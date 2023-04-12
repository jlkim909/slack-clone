import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Input,
  Button,
} from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import "../../firebase";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import { getDatabase, ref, update } from "firebase/database";
import { updateProfile } from "firebase/auth";

function ProfileModal({ open, handleClose }: any) {
  const { user }: any = useSelector((state) => state);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState<string>("");
  const [blob, setBlob] = useState<any>("");
  const avatarEditorRef = useRef<any>(null);

  const closeModal = useCallback(() => {
    handleClose();
    setPreviewImage("");
    setCroppedImage("");
    setUploadedCroppedImage("");
  }, [handleClose]);
  const uploadCroppedImage = useCallback(async () => {
    if (!user.currentUser?.uid) return;
    const storageRef = refStorage(
      getStorage(),
      `avatars/users/${user.currentUser.uid}`
    );
    const uploadTask = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    setUploadedCroppedImage(downloadUrl);
  }, [blob, user.currentUser.uid]);
  const handleCropImage = useCallback(() => {
    avatarEditorRef.current.getImageScaledToCanvas().toBlob((blob: any) => {
      const imageUrl = URL.createObjectURL(blob);
      setCroppedImage(imageUrl);
      setBlob(blob);
    });
  }, []);

  const handleChange = useCallback((e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader() as any;
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      setPreviewImage(reader.result);
    });
  }, []);

  useEffect(() => {
    if (!uploadedCroppedImage || !user.currentUser) return;
    async function changeAvatar() {
      await updateProfile(user.currentUser, {
        photoURL: uploadedCroppedImage,
      });
      const updates = {} as any;
      updates["/users/" + user.currentUser.uid + "/avatar"] =
        uploadedCroppedImage;
      await update(ref(getDatabase()), updates);
      closeModal();
    }
    changeAvatar();
  }, [user.currentUser, uploadedCroppedImage, closeModal]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>프로필 이미지 변경</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={3}>
          <Input
            type="file"
            inputProps={{ accept: "image/jpeg, image/jpg, image/png" }}
            placeholder="변경할 프로필 선택"
            onChange={handleChange}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {previewImage && (
              <AvatarEditor
                ref={avatarEditorRef}
                image={previewImage}
                width={120}
                height={120}
                border={20}
                scale={2}
                style={{ display: "inline" }}
              />
            )}
            {croppedImage && (
              <img
                alt="cropped"
                style={{ marginLeft: "50px" }}
                width={100}
                height={100}
                src={croppedImage}
              />
            )}
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        {previewImage && <Button onClick={handleCropImage}>이미지 Crop</Button>}
        {croppedImage && (
          <Button onClick={uploadCroppedImage}>프로필 이미지 저장</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ProfileModal;

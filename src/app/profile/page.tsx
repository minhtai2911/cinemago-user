import ProfileLayout from "../../components/profile/ProfileLayout";
import PersonalInfoSection from "../../components/profile/PersonalInfoForm";
import ChangePasswordSection from "../../components/profile/ChangePasswordSection";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProfileLayout>
        {/* Layout 2 cột: Left (Info) - Right (Password) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">
          {/* Cột trái: Thông tin cá nhân & Avatar */}
          <div className="h-full">
            <PersonalInfoSection />
          </div>

          {/* Cột phải: Đổi mật khẩu */}
          <div className="h-full">
            <ChangePasswordSection />
          </div>
        </div>
      </ProfileLayout>
    </>
  );
}

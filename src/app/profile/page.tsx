import ProfileLayout from "../../components/profile/ProfileLayout";
import PersonalInfoSection from "../../components/profile/PersonalInfoForm";
import ChangePasswordSection from "../../components/profile/ChangePasswordSection";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProfileLayout>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">
          <div className="h-full">
            <PersonalInfoSection />
          </div>

          <div className="h-full">
            <ChangePasswordSection />
          </div>
        </div>
      </ProfileLayout>
    </>
  );
}

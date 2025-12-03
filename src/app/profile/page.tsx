import ProfileLayout from "../../components/profile/ProfileLayout";
import PersonalInfoSection from "../../components/profile/PersonalInfoForm";
import ChangePasswordSection from "../../components/profile/ChangePasswordSection";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProfileLayout>
        <PersonalInfoSection />
        <ChangePasswordSection />
      </ProfileLayout>
    </>
  );
}

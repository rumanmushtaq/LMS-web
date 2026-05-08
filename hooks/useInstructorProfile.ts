import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import usersService, { UpdateProfileParams } from "@/services/users";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short").max(50),
  lastName: z.string().min(2, "Last name is too short").max(50),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        institution: z.string().min(1, "Institution is required"),
        period: z.string().min(1, "Period is required"),
      }),
    )
    .optional(),
  experience: z
    .array(
      z.object({
        role: z.string().min(1, "Role is required"),
        company: z.string().min(1, "Company is required"),
        period: z.string().min(1, "Period is required"),
      }),
    )
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useInstructorProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
      dob: "",
      bio: "",
      education: [],
      experience: [],
    },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await usersService.getProfile();
      setProfile(data);

      // Map API data to form values
      let formattedDob = "";
      if (data.kycData?.dob) {
        try {
          formattedDob = new Date(data.kycData.dob).toISOString().split("T")[0];
        } catch (e) {}
      }

      form.reset({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.kycData?.phone || "",
        gender: data.kycData?.gender || "",
        dob: formattedDob,
        bio: data.kycData?.bio || "",
        education: data.kycData?.education || [],
        experience: data.kycData?.experience || [],
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // If cancelling, reset form to current profile data
      fetchProfile();
    }
    setIsEditing(!isEditing);
  };

  const updateProfile = async (values: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      const updateData: UpdateProfileParams = {
        ...values,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
      };

      const updatedProfile = await usersService.updateProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    loading,
    isEditing,
    isUpdating,
    form,
    toggleEdit,
    updateProfile: form.handleSubmit(updateProfile),
  };
};

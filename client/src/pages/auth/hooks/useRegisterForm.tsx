import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  registerValidator,
  RegisterValidator,
} from "../validators/auth.validator";
import { authApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
export const useRegisterForm = () => {
  const form = useForm<RegisterValidator>({
    resolver: zodResolver(registerValidator),
  });

  const mutator = useMutation({
    mutationKey: ["verification"],

    mutationFn: async (user: RegisterValidator) => {
      const response = await authApi.post("/verification", user);
      return response.data;
    },

    onSuccess: (data: any) => {
      form.reset();

      toast({
        title: "Verification email sent",
        description:
          data?.message ||
          "Please check your inbox to verify your Daily Dev account.",
      });
    },

    onError: (error: ErrResponse) => {
      toast({
        title: "Registration failed",
        description:
          error.response?.data?.message ||
          "Unable to process your registration right now. Please try again later.",
        variant: "destructive",
      });

      console.log(error);
    },
  });

  return {
    form: { ...form },
    mutations: { ...mutator },
  };
};

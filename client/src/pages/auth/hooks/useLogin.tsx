import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { loginValidator, LoginValidator } from "../validators/auth.validator";
import { authApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export const useLogin = () => {
  const form = useForm<LoginValidator>({
    resolver: zodResolver(loginValidator),
  });
  const mutator = useMutation({
    mutationKey: ["logInToAccount"],
    mutationFn: async (user: LoginValidator) => {
      const { data } = await authApi.post("/login", user);
      console.log(data);
    },
    onSuccess: (data: any) => {
      form.reset();

      toast({
        title: "Login successful",
        description: data?.message || "You have been logged in successfully.",
      });

      window.location.reload();
    },

    onError: (error: ErrResponse) => {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.message ||
          "Unable to log in right now. Please try again later.",
        variant: "destructive",
      });

      console.log(error);
    },
  });

  return { form: { ...form }, mutations: { ...mutator } };
};

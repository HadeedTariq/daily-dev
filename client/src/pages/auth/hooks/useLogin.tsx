import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { loginValidator, LoginValidator } from "../validators/auth.validator";
import { authApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export const useLogin = () => {
  const navigate = useNavigate();
  const form = useForm<LoginValidator>({
    resolver: zodResolver(loginValidator),
  });
  const mutator = useMutation({
    mutationKey: ["logInToAccount"],
    mutationFn: async (user: LoginValidator) => {
      const { data } = await authApi.post("/login", user);
      return data;
    },
    onSuccess: (data: any) => {
      form.reset();
      toast({
        title: data.message || "User logged in successfully",
        variant: "default",
      });
      setTimeout(() => {
        navigate("/");
      }, 1200);
    },
    onError: (err: ErrResponse) => {
      toast({
        title: err.response.data.message || "Failed to send verification email",
        variant: "destructive",
      });
    },
  });

  return { form: { ...form }, mutations: { ...mutator } };
};

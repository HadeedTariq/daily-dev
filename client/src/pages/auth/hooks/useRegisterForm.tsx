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
      const { data } = await authApi.post("/verification", user);
      return data;
    },
    onSuccess: (data: any) => {
      form.reset();
      toast({
        title: data.message || "Verification email sent on your mail",
        variant: "default",
      });
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

import { Link } from "react-router-dom";
import { RegisterValidator } from "../validators/auth.validator";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Loader2, User, Mail, Lock, Briefcase } from "lucide-react";
import GitHubLoginButton from "../components/GithubLogin";

const Register = () => {
  const {
    form: { register, formState, handleSubmit },
    mutations: { mutate: registerAccount, isPending },
  } = useRegisterForm();

  const createAccount = (user: RegisterValidator) => {
    registerAccount(user);
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Office workspace"
            src="/main.jpeg"
            className="absolute inset-0 h-full w-full object-fill max-[1050px]:object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl w-full">
            <div className="relative">
              <div className="relative">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                  Welcome to Daily Dev
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Join our community of developers and start your journey today
                </p>
              </div>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={handleSubmit(createAccount)}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Username */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pl-10 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...register("username")}
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {formState.errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.username.message}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pl-10 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {formState.errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="relative sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pl-10 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...register("email")}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pl-10 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...register("password")}
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Profession */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profession
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pl-10 text-sm text-gray-700 dark:text-gray-300 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...register("profession")}
                    />
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {formState.errors.profession && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.profession.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 pt-4">
                <button
                  disabled={formState.disabled || isPending}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>

                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 sm:mt-0">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </form>
            <GitHubLoginButton />
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;

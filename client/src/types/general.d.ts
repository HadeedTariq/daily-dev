type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type ErrResponse = {
  response: {
    data: {
      message: string;
    };
  };
};

export { User, ErrResponse };

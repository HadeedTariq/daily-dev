type User = {
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

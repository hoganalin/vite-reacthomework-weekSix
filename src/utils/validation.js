export const emailValidation = {
  required: '請輸入email',
  pattern: {
    value: /^\S+@\S+$/i,
    message: '請輸入正確email格式',
  },
};

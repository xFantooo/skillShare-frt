export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  //   console.log(formData.get("email"));
  if (formData.get("username") !== null && !formData.get("username").trim())
    errors.username = "Username is required.";
  // console.log(errors.username);
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );
  const email = formData.get("email").trim();
  if (!emailRegex.test(email)) {
    errors.email = "Email is invalid.";
    console.log(errors.email);
  }

  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$"
  );
  const password = formData.get("password").trim();
  if (!passwordRegex.test(password)) {
    errors.password =
      "Password must be at least 12 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    console.log(errors.password);
  }

  if (formData.get("avatar")) {
    const file = formData.get("avatar");
    const errorsAvatarTab = [];
    if (!file.name) {
      errorsAvatarTab.push("Avatar is required.");
    }
    if (file.name && !file.type.match(/image\/(png|jpg|jpeg|gif)$/)) {
      errorsAvatarTab.push(
        "Avatar must be an image file (png, jpg, jpeg, gif)."
      );
      console.log(errors.avatar);
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file && file.size > maxSize) {
      errorsAvatarTab.push(`Avatar must be less than ${maxSize} bytes.`);
    }
    if (errorsAvatarTab.length > 0) {
      errors.avatar = errorsAvatarTab.join(" ");
      console.log(errors.avatar);
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors: errors,
  };
}

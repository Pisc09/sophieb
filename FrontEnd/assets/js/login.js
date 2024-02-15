const form = document.querySelector("form");
// console.log(form);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  console.log(email);

  const password = document.querySelector("#password").value;
  console.log(password);

  // if (email === "sophie.bluel@test.tld" && password === "S0phie") {
  //   localStorage.setItem("isLoggedIn", "true");
  //   window.location.href = "index.html";
  // } else {
  //   const messageErreur = document.querySelector("#error-message");
  //   messageErreur.textContent = "E-mail ou mot de passe incorrect";
  // }

  const data = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur : d'authentification");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      window.localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error :", error);
      const messageErreur = document.querySelector("#error-message");
      messageErreur.textContent = "E-mail ou mot de passe incorrect";
    });
});

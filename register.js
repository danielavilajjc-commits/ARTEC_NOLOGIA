// Importar Firebase y sus módulos
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtUed7rRqISNCcksKOKvq_V0UHiV2JyYM",
  authDomain: "artecnologia-3d705.firebaseapp.com",
  projectId: "artecnologia-3d705",
  storageBucket: "artecnologia-3d705.firebasestorage.app",
  messagingSenderId: "80571309588",
  appId: "1:80571309588:web:05b7a9972aa91e1f671101",
  measurementId: "G-S343D54DHB"
};

// Inicializar Firebase y sus servicios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Capturar el formulario de registro
const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const age = document.getElementById('age').value;
  const password = document.getElementById('password').value;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
    await sendEmailVerification(user);

    // Guardar datos extra en Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      email,
      phone,
      age,
      createdAt: serverTimestamp()
    });

    alert("¡Registro exitoso! Revisa tu correo para verificar tu cuenta.");
    form.reset();
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

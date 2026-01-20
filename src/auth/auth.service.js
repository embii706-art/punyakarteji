
import { auth, db } from "../config/firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function login(email,password){
 return signInWithEmailAndPassword(auth,email,password);
}

export async function registerFirst(data){
 const c = await createUserWithEmailAndPassword(auth,data.email,data.password);
 await setDoc(doc(db,'users',c.user.uid),{
  name:data.name,
  role:'super_admin'
 });
}


import { auth } from "../config/firebase.js";
export function authGuard(){
 auth.onAuthStateChanged(u=>{
  if(!u) console.log('Not logged in');
 });
}


import { login } from "../auth/auth.service.js";
import { renderDashboard } from "./dashboard.js";

export function renderLogin(){
 document.getElementById('app').innerHTML=`
 <div class="p-4">
  <h1 class="text-xl mb-2">Login KARTEJI</h1>
  <input id="email" class="border p-2 w-full mb-2" placeholder="Email"/>
  <input id="pass" type="password" class="border p-2 w-full mb-2" placeholder="Password"/>
  <button id="btn" class="bg-blue-600 text-white p-2 w-full">Login</button>
 </div>`;

 document.getElementById('btn').onclick=async()=>{
  await login(email.value,pass.value);
  renderDashboard();
 };
}

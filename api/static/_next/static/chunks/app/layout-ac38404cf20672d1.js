(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{7951:(e,t,o)=>{Promise.resolve().then(o.t.bind(o,9324,23)),Promise.resolve().then(o.bind(o,9404)),Promise.resolve().then(o.bind(o,1069)),Promise.resolve().then(o.bind(o,9474))},9404:(e,t,o)=>{"use strict";o.d(t,{ActivityTracker:()=>n});var r=o(2115),a=o(6046),s=o(1069);function n(){let e=(0,a.usePathname)(),{user:t}=(0,s.A)();return(0,r.useEffect)(()=>{t&&(async()=>{try{let t=localStorage.getItem("token");if(!t)return;await fetch("".concat("http://localhost:8080/api","/admin/activity/log"),{method:"POST",headers:{Authorization:"Bearer ".concat(t),"Content-Type":"application/json"},body:JSON.stringify({action:"Page visit",details:"Visited ".concat(e),page_url:e})})}catch(e){console.error("Failed to log page visit:",e)}})()},[e,t]),null}},1069:(e,t,o)=>{"use strict";o.d(t,{A:()=>l,AuthProvider:()=>i});var r=o(5155),a=o(2115),s=o(6046);let n=(0,a.createContext)(void 0);function i(e){let{children:t}=e,[o,i]=(0,a.useState)(null),[l,c]=(0,a.useState)(!0),[u,d]=(0,a.useState)(null),h=(0,s.useRouter)();(0,a.useEffect)(()=>{let e=localStorage.getItem("user");if(e)try{i(JSON.parse(e))}catch(e){console.error("Failed to parse stored user",e),localStorage.removeItem("user")}c(!1)},[]);let m=async(e,t)=>{c(!0),d(null);try{let o="".concat("http://localhost:8080/api","/auth/token");console.log("Attempting to login at:",o);let r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({username:e,password:t})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Login failed")}let a=await r.json();localStorage.setItem("token",a.access_token),localStorage.setItem("user",JSON.stringify({username:a.username,role:a.role})),i({username:a.username,role:a.role}),h.push("/")}catch(e){console.error("Login error:",e),d(e instanceof Error?e.message:"Login failed. Please check your credentials.")}finally{c(!1)}},g=async function(e,t,o){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"user";c(!0),d(null);try{let a="".concat("http://localhost:8080/api","/auth/register");console.log("Attempting to register at:",a);let s=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:o,role:r})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Registration failed")}await m(e,o)}catch(e){console.error("Registration error:",e),d(e instanceof Error?e.message:"Registration failed"),c(!1)}},f=async e=>{c(!0),d(null);try{let t="".concat("http://localhost:8080/api","/auth/forgot-password");console.log("Requesting password reset at:",t);let o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!o.ok){let e=await o.json();throw Error(e.detail||"Failed to process request")}}catch(e){console.error("Forgot password error:",e),d(e instanceof Error?e.message:"Failed to process request")}finally{c(!1)}},p=async(e,t)=>{c(!0),d(null);try{let o="".concat("http://localhost:8080/api","/auth/reset-password");console.log("Resetting password at:",o);let r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,password:t})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Failed to reset password")}}catch(e){throw console.error("Reset password error:",e),d(e instanceof Error?e.message:"Failed to reset password"),e}finally{c(!1)}};return(0,r.jsx)(n.Provider,{value:{user:o,login:m,register:g,forgotPassword:f,resetPassword:p,logout:()=>{sessionStorage.setItem("isLoggingOut","true"),localStorage.removeItem("token"),localStorage.removeItem("user"),i(null),h.push("/")},isLoading:l,error:u},children:t})}function l(){let e=(0,a.useContext)(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},9474:(e,t,o)=>{"use strict";o.d(t,{D:()=>i,ThemeProvider:()=>n});var r=o(5155),a=o(2115);let s=(0,a.createContext)(void 0);function n(e){let{children:t}=e,[o,n]=(0,a.useState)("dark");return(0,a.useEffect)(()=>{let e=localStorage.getItem("theme");e?n(e):n(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")},[]),(0,a.useEffect)(()=>{"dark"===o?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),localStorage.setItem("theme",o)},[o]),(0,r.jsx)(s.Provider,{value:{theme:o,toggleTheme:()=>{n(e=>"dark"===e?"light":"dark")},setTheme:n},children:t})}function i(){let e=(0,a.useContext)(s);if(void 0===e)throw Error("useTheme must be used within a ThemeProvider");return e}},6046:(e,t,o)=>{"use strict";var r=o(6658);o.o(r,"usePathname")&&o.d(t,{usePathname:function(){return r.usePathname}}),o.o(r,"useRouter")&&o.d(t,{useRouter:function(){return r.useRouter}}),o.o(r,"useSearchParams")&&o.d(t,{useSearchParams:function(){return r.useSearchParams}})},9324:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[533,441,517,358],()=>t(7951)),_N_E=e.O()}]);
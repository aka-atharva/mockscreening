(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{2870:(e,t,o)=>{Promise.resolve().then(o.t.bind(o,9324,23)),Promise.resolve().then(o.bind(o,1069))},1069:(e,t,o)=>{"use strict";o.d(t,{A:()=>i,AuthProvider:()=>l});var r=o(5155),a=o(2115),s=o(6046);let n=(0,a.createContext)(void 0);function l(e){let{children:t}=e,[o,l]=(0,a.useState)(null),[i,c]=(0,a.useState)(!0),[u,h]=(0,a.useState)(null),d=(0,s.useRouter)();(0,a.useEffect)(()=>{let e=localStorage.getItem("user");if(e)try{l(JSON.parse(e))}catch(e){console.error("Failed to parse stored user",e),localStorage.removeItem("user")}c(!1)},[]);let p=async(e,t)=>{c(!0),h(null);try{let o="".concat("http://localhost:8000/api","/auth/token");console.log("Attempting to login at:",o);let r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({username:e,password:t})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Login failed")}let a=await r.json();localStorage.setItem("token",a.access_token),localStorage.setItem("user",JSON.stringify({username:a.username,role:a.role})),l({username:a.username,role:a.role}),d.push("/")}catch(e){console.error("Login error:",e),h(e instanceof Error?e.message:"Login failed. Please check your credentials.")}finally{c(!1)}},f=async function(e,t,o){let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"user";c(!0),h(null);try{let a="".concat("http://localhost:8000/api","/auth/register");console.log("Attempting to register at:",a);let s=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:o,role:r})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Registration failed")}await p(e,o)}catch(e){console.error("Registration error:",e),h(e instanceof Error?e.message:"Registration failed"),c(!1)}},g=async e=>{c(!0),h(null);try{let t="".concat("http://localhost:8000/api","/auth/forgot-password");console.log("Requesting password reset at:",t);let o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!o.ok){let e=await o.json();throw Error(e.detail||"Failed to process request")}}catch(e){console.error("Forgot password error:",e),h(e instanceof Error?e.message:"Failed to process request")}finally{c(!1)}},m=async(e,t)=>{c(!0),h(null);try{let o="".concat("http://localhost:8000/api","/auth/reset-password");console.log("Resetting password at:",o);let r=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,password:t})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Failed to reset password")}}catch(e){throw console.error("Reset password error:",e),h(e instanceof Error?e.message:"Failed to reset password"),e}finally{c(!1)}};return(0,r.jsx)(n.Provider,{value:{user:o,login:p,register:f,forgotPassword:g,resetPassword:m,logout:()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),l(null),d.push("/")},isLoading:i,error:u},children:t})}function i(){let e=(0,a.useContext)(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},6046:(e,t,o)=>{"use strict";var r=o(6658);o.o(r,"usePathname")&&o.d(t,{usePathname:function(){return r.usePathname}}),o.o(r,"useRouter")&&o.d(t,{useRouter:function(){return r.useRouter}}),o.o(r,"useSearchParams")&&o.d(t,{useSearchParams:function(){return r.useSearchParams}})},9324:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[533,441,517,358],()=>t(2870)),_N_E=e.O()}]);
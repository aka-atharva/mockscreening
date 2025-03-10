(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[700],{5218:(e,t,r)=>{Promise.resolve().then(r.bind(r,1718))},1718:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>x});var s=r(5155),a=r(2115),i=r(425),o=r(8888),n=r(7410),l=r(3950),d=r(3239),c=r(7364),h=r(8686),u=r(8173),m=r.n(u),f=r(4085),p=r(2336),w=r(1069),g=r(6046);function x(){let[e,t]=(0,a.useState)(""),[r,u]=(0,a.useState)(""),[x,y]=(0,a.useState)(null),[v,b]=(0,a.useState)(!1),[j,k]=(0,a.useState)(!1),[N,S]=(0,a.useState)(null),{useFallbackMode:F}=(0,w.A)(),A=(0,g.useSearchParams)(),E=(0,g.useRouter)();(0,a.useEffect)(()=>{let e=A.get("token");e?y(e):S("Missing reset token. Please request a new password reset link.")},[A]);let P=async t=>{if(t.preventDefault(),e!==r){S("Passwords do not match");return}if(!x){S("Missing reset token");return}b(!0),S(null);try{if(F){await new Promise(e=>setTimeout(e,1e3)),k(!0);return}let t=await fetch("".concat("http://192.168.29.166:8080/api","/auth/reset-password"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:x,password:e})}),r=t.headers.get("content-type");if(!r||!r.includes("application/json")){let e=await t.text();throw console.error("Received non-JSON response:",e.substring(0,200)+"..."),Error("Server returned non-JSON response. API might be unavailable.")}if(!t.ok){let e=await t.json();throw Error(e.detail||"Failed to reset password")}k(!0)}catch(e){console.error("Password reset error:",e),S(e instanceof Error?e.message:"Failed to reset password"),e instanceof TypeError&&"Failed to fetch"===e.message&&S("Cannot connect to the server. The system is in demo mode.")}finally{b(!1)}};return(0,a.useEffect)(()=>{if(j){let e=setTimeout(()=>{E.push("/login")},3e3);return()=>clearTimeout(e)}},[j,E]),(0,s.jsxs)("main",{className:"min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden",children:[(0,s.jsx)("div",{className:"h-full w-full absolute inset-0 z-0",children:(0,s.jsx)(i.SparklesCore,{id:"tsparticlesfullpage",background:"transparent",minSize:.6,maxSize:1.4,particleDensity:100,className:"w-full h-full",particleColor:"#FFFFFF"})}),(0,s.jsx)("div",{className:"relative z-10 flex items-center justify-center min-h-screen",children:(0,s.jsxs)(o.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-md p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10",children:[(0,s.jsx)("div",{className:"flex justify-center mb-6",children:(0,s.jsx)(n.A,{className:"w-12 h-12 text-purple-500"})}),(0,s.jsx)("h1",{className:"text-3xl font-bold text-white text-center mb-6",children:"Set New Password"}),N&&(0,s.jsx)("div",{className:"bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4",children:N}),F&&!j&&(0,s.jsxs)("div",{className:"bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-md mb-4 flex items-start",children:[(0,s.jsx)(l.A,{className:"h-5 w-5 mr-2 mt-0.5 flex-shrink-0"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"font-medium",children:"Using Demo Mode"}),(0,s.jsx)("p",{className:"text-sm",children:"API server is unavailable. Password reset will be simulated."})]})]}),j?(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsx)("div",{className:"flex justify-center mb-4",children:(0,s.jsx)(d.A,{className:"w-16 h-16 text-green-500"})}),(0,s.jsx)("h2",{className:"text-xl font-semibold text-white mb-2",children:"Password Reset Successful"}),(0,s.jsx)("p",{className:"text-gray-400 mb-6",children:"Your password has been reset successfully. You will be redirected to the login page."}),(0,s.jsxs)(m(),{href:"/login",className:"text-purple-400 hover:text-purple-300 flex items-center justify-center",children:[(0,s.jsx)(c.A,{className:"w-4 h-4 mr-2"}),"Back to Login"]})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{className:"text-gray-400 mb-6",children:"Enter your new password below."}),(0,s.jsxs)("form",{onSubmit:P,className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-300 mb-1",children:"New Password"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(h.A,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),(0,s.jsx)(p.p,{id:"password",type:"password",value:e,onChange:e=>t(e.target.value),className:"pl-10 bg-white/5 border-white/10 text-white",placeholder:"Enter new password",required:!0,minLength:6})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"confirmPassword",className:"block text-sm font-medium text-gray-300 mb-1",children:"Confirm New Password"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(h.A,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),(0,s.jsx)(p.p,{id:"confirmPassword",type:"password",value:r,onChange:e=>u(e.target.value),className:"pl-10 bg-white/5 border-white/10 text-white",placeholder:"Confirm new password",required:!0,minLength:6})]})]}),(0,s.jsx)(f.Button,{type:"submit",className:"w-full bg-purple-600 hover:bg-purple-700 text-white",disabled:v||!x,children:v?"Resetting...":"Reset Password"})]}),(0,s.jsx)("div",{className:"mt-6 text-center",children:(0,s.jsxs)(m(),{href:"/login",className:"text-purple-400 hover:text-purple-300 flex items-center justify-center",children:[(0,s.jsx)(c.A,{className:"w-4 h-4 mr-2"}),"Back to Login"]})})]})]})})]})}},425:(e,t,r)=>{"use strict";r.d(t,{SparklesCore:()=>o});var s=r(5155),a=r(2115),i=r(9474);let o=e=>{let{id:t="tsparticles",background:r="transparent",minSize:o=.6,maxSize:n=1.4,particleDensity:l=100,className:d="h-full w-full",particleColor:c="#FFFFFF"}=e,h=(0,a.useRef)(null),u=function(){let[e,t]=(0,a.useState)({x:0,y:0});return(0,a.useEffect)(()=>{let e=e=>{t({x:e.clientX,y:e.clientY})};return window.addEventListener("mousemove",e),()=>{window.removeEventListener("mousemove",e)}},[]),e}(),[m,f]=(0,a.useState)({width:1200,height:800}),{theme:p}=(0,i.D)(),w="#FFFFFF"===c||"var(--foreground)"===c?"dark"===p?"#FFFFFF":"#000000":c;return(0,a.useEffect)(()=>{let e;f({width:window.innerWidth,height:window.innerHeight});let t=h.current;if(!t)return;let r=t.getContext("2d");if(!r)return;let s=[];t.width=window.innerWidth,t.height=window.innerHeight;class a{update(){this.x+=this.speedX,this.y+=this.speedY,this.x>t.width&&(this.x=0),this.x<0&&(this.x=t.width),this.y>t.height&&(this.y=0),this.y<0&&(this.y=t.height);let e=u.x-this.x,r=u.y-this.y;if(100>Math.sqrt(e*e+r*r)){let t=Math.atan2(r,e);this.x-=1*Math.cos(t),this.y-=1*Math.sin(t)}}draw(){r&&(r.fillStyle=w,r.beginPath(),r.arc(this.x,this.y,this.size,0,2*Math.PI),r.fill())}constructor(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*(n-o)+o,this.speedX=.5*Math.random()-.25,this.speedY=.5*Math.random()-.25}}let i=()=>{s=[];for(let e=0;e<l;e++)s.push(new a)},d=()=>{r&&(r.clearRect(0,0,t.width,t.height),s.forEach(e=>{e.update(),e.draw()}),e=requestAnimationFrame(d))};i(),d();let c=()=>{t.width=window.innerWidth,t.height=window.innerHeight,f({width:window.innerWidth,height:window.innerHeight}),i()};return window.addEventListener("resize",c),()=>{window.removeEventListener("resize",c),cancelAnimationFrame(e)}},[n,o,w,l,u.x,u.y]),(0,s.jsx)("canvas",{ref:h,id:t,className:d,style:{background:r,width:m.width,height:m.height}})}},4085:(e,t,r)=>{"use strict";r.d(t,{Button:()=>d});var s=r(5155),a=r(2115),i=r(2317),o=r(6421),n=r(9602);let l=(0,o.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=a.forwardRef((e,t)=>{let{className:r,variant:a,size:o,asChild:d=!1,...c}=e,h=d?i.DX:"button";return(0,s.jsx)(h,{className:(0,n.cn)(l({variant:a,size:o,className:r})),ref:t,...c})});d.displayName="Button"},2336:(e,t,r)=>{"use strict";r.d(t,{p:()=>o});var s=r(5155),a=r(2115),i=r(9602);let o=a.forwardRef((e,t)=>{let{className:r,type:a,...o}=e;return(0,s.jsx)("input",{type:a,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...o})});o.displayName="Input"},1069:(e,t,r)=>{"use strict";r.d(t,{A:()=>l,AuthProvider:()=>n});var s=r(5155),a=r(2115),i=r(6046);let o=(0,a.createContext)(void 0);function n(e){let{children:t}=e,[r,n]=(0,a.useState)(null),[l,d]=(0,a.useState)(!0),[c,h]=(0,a.useState)(null),u=(0,i.useRouter)();(0,a.useEffect)(()=>{let e=localStorage.getItem("user");if(e)try{n(JSON.parse(e))}catch(e){console.error("Failed to parse stored user",e),localStorage.removeItem("user")}d(!1)},[]);let m=async(e,t)=>{d(!0),h(null);try{let r="".concat("http://192.168.29.166:8080/api","/auth/token");console.log("Attempting to login at:",r);let s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({username:e,password:t})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Login failed")}let a=await s.json();localStorage.setItem("token",a.access_token),localStorage.setItem("user",JSON.stringify({username:a.username,role:a.role})),n({username:a.username,role:a.role}),u.push("/")}catch(e){console.error("Login error:",e),h(e instanceof Error?e.message:"Login failed. Please check your credentials.")}finally{d(!1)}},f=async function(e,t,r){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"user";d(!0),h(null);try{let a="".concat("http://192.168.29.166:8080/api","/auth/register");console.log("Attempting to register at:",a);let i=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:r,role:s})});if(!i.ok){let e=await i.json();throw Error(e.detail||"Registration failed")}await m(e,r)}catch(e){console.error("Registration error:",e),h(e instanceof Error?e.message:"Registration failed"),d(!1)}},p=async e=>{d(!0),h(null);try{let t="".concat("http://192.168.29.166:8080/api","/auth/forgot-password");console.log("Requesting password reset at:",t);let r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Failed to process request")}}catch(e){console.error("Forgot password error:",e),h(e instanceof Error?e.message:"Failed to process request")}finally{d(!1)}},w=async(e,t)=>{d(!0),h(null);try{let r="".concat("http://192.168.29.166:8080/api","/auth/reset-password");console.log("Resetting password at:",r);let s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,password:t})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Failed to reset password")}}catch(e){throw console.error("Reset password error:",e),h(e instanceof Error?e.message:"Failed to reset password"),e}finally{d(!1)}};return(0,s.jsx)(o.Provider,{value:{user:r,login:m,register:f,forgotPassword:p,resetPassword:w,logout:()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),n(null),u.push("/")},isLoading:l,error:c},children:t})}function l(){let e=(0,a.useContext)(o);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},9474:(e,t,r)=>{"use strict";r.d(t,{D:()=>n,ThemeProvider:()=>o});var s=r(5155),a=r(2115);let i=(0,a.createContext)(void 0);function o(e){let{children:t}=e,[r,o]=(0,a.useState)("dark");return(0,a.useEffect)(()=>{let e=localStorage.getItem("theme");e?o(e):o(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")},[]),(0,a.useEffect)(()=>{"dark"===r?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),localStorage.setItem("theme",r)},[r]),(0,s.jsx)(i.Provider,{value:{theme:r,toggleTheme:()=>{o(e=>"dark"===e?"light":"dark")},setTheme:o},children:t})}function n(){let e=(0,a.useContext)(i);if(void 0===e)throw Error("useTheme must be used within a ThemeProvider");return e}},9602:(e,t,r)=>{"use strict";function s(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter(Boolean).join(" ")}r.d(t,{cn:()=>s})},7364:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},7410:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]])},3239:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},8686:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]])},3950:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]])}},e=>{var t=t=>e(e.s=t);e.O(0,[489,441,517,358],()=>t(5218)),_N_E=e.O()}]);
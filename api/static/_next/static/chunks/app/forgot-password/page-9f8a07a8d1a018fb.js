(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[162],{6574:(e,t,r)=>{Promise.resolve().then(r.bind(r,1500))},1500:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>w});var s=r(5155),i=r(2115),a=r(425),o=r(8888),n=r(7410),l=r(3950),d=r(3239),c=r(7364),h=r(6462),u=r(8173),m=r.n(u),p=r(4085),f=r(2336),g=r(1069);function w(){let[e,t]=(0,i.useState)(""),[r,u]=(0,i.useState)(!1),[w,x]=(0,i.useState)(!1),[y,b]=(0,i.useState)(null),{useFallbackMode:v}=(0,g.A)(),j=async t=>{t.preventDefault(),u(!0),b(null);try{if(v){await new Promise(e=>setTimeout(e,1e3)),x(!0);return}let t=await fetch("".concat("http://localhost:8080/api","/auth/forgot-password"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})}),r=t.headers.get("content-type");if(!r||!r.includes("application/json")){let e=await t.text();throw console.error("Received non-JSON response:",e.substring(0,200)+"..."),Error("Server returned non-JSON response. API might be unavailable.")}if(!t.ok){let e=await t.json();throw Error(e.detail||"Failed to process request")}x(!0)}catch(e){console.error("Password reset request error:",e),b(e instanceof Error?e.message:"Failed to process request"),e instanceof TypeError&&"Failed to fetch"===e.message&&b("Cannot connect to the server. The system is in demo mode.")}finally{u(!1)}};return(0,s.jsxs)("main",{className:"min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden",children:[(0,s.jsx)("div",{className:"h-full w-full absolute inset-0 z-0",children:(0,s.jsx)(a.SparklesCore,{id:"tsparticlesfullpage",background:"transparent",minSize:.6,maxSize:1.4,particleDensity:100,className:"w-full h-full",particleColor:"#FFFFFF"})}),(0,s.jsx)("div",{className:"relative z-10 flex items-center justify-center min-h-screen",children:(0,s.jsxs)(o.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-full max-w-md p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10",children:[(0,s.jsx)("div",{className:"flex justify-center mb-6",children:(0,s.jsx)(n.A,{className:"w-12 h-12 text-purple-500"})}),(0,s.jsx)("h1",{className:"text-3xl font-bold text-white text-center mb-6",children:"Reset Password"}),y&&(0,s.jsx)("div",{className:"bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md mb-4",children:y}),v&&!w&&(0,s.jsxs)("div",{className:"bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-md mb-4 flex items-start",children:[(0,s.jsx)(l.A,{className:"h-5 w-5 mr-2 mt-0.5 flex-shrink-0"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"font-medium",children:"Using Demo Mode"}),(0,s.jsx)("p",{className:"text-sm",children:"API server is unavailable. Password reset will be simulated."})]})]}),w?(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsx)("div",{className:"flex justify-center mb-4",children:(0,s.jsx)(d.A,{className:"w-16 h-16 text-green-500"})}),(0,s.jsx)("h2",{className:"text-xl font-semibold text-white mb-2",children:"Reset Link Sent"}),(0,s.jsxs)("p",{className:"text-gray-400 mb-6",children:["If an account exists with the email ",e,", you will receive password reset instructions."]}),(0,s.jsxs)(m(),{href:"/login",className:"text-purple-400 hover:text-purple-300 flex items-center justify-center",children:[(0,s.jsx)(c.A,{className:"w-4 h-4 mr-2"}),"Back to Login"]})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{className:"text-gray-400 mb-6",children:"Enter your email address and we'll send you instructions to reset your password."}),(0,s.jsxs)("form",{onSubmit:j,className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-300 mb-1",children:"Email Address"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(h.A,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"}),(0,s.jsx)(f.p,{id:"email",type:"email",value:e,onChange:e=>t(e.target.value),className:"pl-10 bg-white/5 border-white/10 text-white",placeholder:"Enter your email",required:!0})]})]}),(0,s.jsx)(p.Button,{type:"submit",className:"w-full bg-purple-600 hover:bg-purple-700 text-white",disabled:r,children:r?"Sending...":"Send Reset Link"})]}),(0,s.jsx)("div",{className:"mt-6 text-center",children:(0,s.jsxs)(m(),{href:"/login",className:"text-purple-400 hover:text-purple-300 flex items-center justify-center",children:[(0,s.jsx)(c.A,{className:"w-4 h-4 mr-2"}),"Back to Login"]})})]})]})})]})}},425:(e,t,r)=>{"use strict";r.d(t,{SparklesCore:()=>a});var s=r(5155),i=r(2115);let a=e=>{let{id:t="tsparticles",background:r="transparent",minSize:a=.6,maxSize:o=1.4,particleDensity:n=100,className:l="h-full w-full",particleColor:d="#FFFFFF"}=e,c=(0,i.useRef)(null),h=function(){let[e,t]=(0,i.useState)({x:0,y:0});return(0,i.useEffect)(()=>{let e=e=>{t({x:e.clientX,y:e.clientY})};return window.addEventListener("mousemove",e),()=>{window.removeEventListener("mousemove",e)}},[]),e}(),[u,m]=(0,i.useState)({width:1200,height:800});return(0,i.useEffect)(()=>{let e;m({width:window.innerWidth,height:window.innerHeight});let t=c.current;if(!t)return;let r=t.getContext("2d");if(!r)return;let s=[];t.width=window.innerWidth,t.height=window.innerHeight;class i{update(){this.x+=this.speedX,this.y+=this.speedY,this.x>t.width&&(this.x=0),this.x<0&&(this.x=t.width),this.y>t.height&&(this.y=0),this.y<0&&(this.y=t.height);let e=h.x-this.x,r=h.y-this.y;if(100>Math.sqrt(e*e+r*r)){let t=Math.atan2(r,e);this.x-=1*Math.cos(t),this.y-=1*Math.sin(t)}}draw(){r&&(r.fillStyle=d,r.beginPath(),r.arc(this.x,this.y,this.size,0,2*Math.PI),r.fill())}constructor(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*(o-a)+a,this.speedX=.5*Math.random()-.25,this.speedY=.5*Math.random()-.25}}let l=()=>{s=[];for(let e=0;e<n;e++)s.push(new i)},u=()=>{r&&(r.clearRect(0,0,t.width,t.height),s.forEach(e=>{e.update(),e.draw()}),e=requestAnimationFrame(u))};l(),u();let p=()=>{t.width=window.innerWidth,t.height=window.innerHeight,m({width:window.innerWidth,height:window.innerHeight}),l()};return window.addEventListener("resize",p),()=>{window.removeEventListener("resize",p),cancelAnimationFrame(e)}},[o,a,d,n,h.x,h.y]),(0,s.jsx)("canvas",{ref:c,id:t,className:l,style:{background:r,width:u.width,height:u.height}})}},4085:(e,t,r)=>{"use strict";r.d(t,{Button:()=>d});var s=r(5155),i=r(2115),a=r(1290),o=r(6421),n=r(9602);let l=(0,o.F)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),d=i.forwardRef((e,t)=>{let{className:r,variant:i,size:o,asChild:d=!1,...c}=e,h=d?a.DX:"button";return(0,s.jsx)(h,{className:(0,n.cn)(l({variant:i,size:o,className:r})),ref:t,...c})});d.displayName="Button"},2336:(e,t,r)=>{"use strict";r.d(t,{p:()=>o});var s=r(5155),i=r(2115),a=r(9602);let o=i.forwardRef((e,t)=>{let{className:r,type:i,...o}=e;return(0,s.jsx)("input",{type:i,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),ref:t,...o})});o.displayName="Input"},1069:(e,t,r)=>{"use strict";r.d(t,{A:()=>l,AuthProvider:()=>n});var s=r(5155),i=r(2115),a=r(6046);let o=(0,i.createContext)(void 0);function n(e){let{children:t}=e,[r,n]=(0,i.useState)(null),[l,d]=(0,i.useState)(!0),[c,h]=(0,i.useState)(null),u=(0,a.useRouter)();(0,i.useEffect)(()=>{let e=localStorage.getItem("user");if(e)try{n(JSON.parse(e))}catch(e){console.error("Failed to parse stored user",e),localStorage.removeItem("user")}d(!1)},[]);let m=async(e,t)=>{d(!0),h(null);try{let r="".concat("http://localhost:8080/api","/auth/token");console.log("Attempting to login at:",r);let s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({username:e,password:t})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Login failed")}let i=await s.json();localStorage.setItem("token",i.access_token),localStorage.setItem("user",JSON.stringify({username:i.username,role:i.role})),n({username:i.username,role:i.role}),u.push("/")}catch(e){console.error("Login error:",e),h(e instanceof Error?e.message:"Login failed. Please check your credentials.")}finally{d(!1)}},p=async function(e,t,r){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"user";d(!0),h(null);try{let i="".concat("http://localhost:8080/api","/auth/register");console.log("Attempting to register at:",i);let a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,email:t,password:r,role:s})});if(!a.ok){let e=await a.json();throw Error(e.detail||"Registration failed")}await m(e,r)}catch(e){console.error("Registration error:",e),h(e instanceof Error?e.message:"Registration failed"),d(!1)}},f=async e=>{d(!0),h(null);try{let t="".concat("http://localhost:8080/api","/auth/forgot-password");console.log("Requesting password reset at:",t);let r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!r.ok){let e=await r.json();throw Error(e.detail||"Failed to process request")}}catch(e){console.error("Forgot password error:",e),h(e instanceof Error?e.message:"Failed to process request")}finally{d(!1)}},g=async(e,t)=>{d(!0),h(null);try{let r="".concat("http://localhost:8080/api","/auth/reset-password");console.log("Resetting password at:",r);let s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e,password:t})});if(!s.ok){let e=await s.json();throw Error(e.detail||"Failed to reset password")}}catch(e){throw console.error("Reset password error:",e),h(e instanceof Error?e.message:"Failed to reset password"),e}finally{d(!1)}};return(0,s.jsx)(o.Provider,{value:{user:r,login:m,register:p,forgotPassword:f,resetPassword:g,logout:()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),n(null),u.push("/")},isLoading:l,error:c},children:t})}function l(){let e=(0,i.useContext)(o);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},9602:(e,t,r)=>{"use strict";function s(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter(Boolean).join(" ")}r.d(t,{cn:()=>s})},7364:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},7410:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]])},3239:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},6462:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},3950:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]])}},e=>{var t=t=>e(e.s=t);e.O(0,[362,441,517,358],()=>t(6574)),_N_E=e.O()}]);
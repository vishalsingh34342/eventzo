import React, { 
  useContext, 
  useEffect, 
  useRef, 
  useState, 
} from "react"; 
 
import { Link, useNavigate } from "react-router-dom"; 
 
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaTicketAlt, 
  FaShieldAlt, 
  FaCheckCircle, 
} from "react-icons/fa"; 
 
import gsap from "gsap"; 
 
import { AuthContext } from "../context/AuthContext"; 
 
const Login = () => { 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
 
  const { login } = useContext(AuthContext); 
 
  const navigate = useNavigate(); 
 
  const containerRef = useRef(null); 
  const leftRef = useRef(null); 
  const rightRef = useRef(null); 
 
  // Page animation 
  useEffect(() => { 
    const tl = gsap.timeline(); 
 
    tl.fromTo( 
      containerRef.current, 
      { 
        opacity: 0, 
      }, 
      { 
        opacity: 1, 
        duration: 0.5, 
      } 
    ); 
 
    tl.fromTo( 
      leftRef.current, 
      { 
        x: -40, 
        opacity: 0, 
      }, 
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power4.out", 
      }, 
      "-=0.2" 
    ); 
 
    tl.fromTo( 
      rightRef.current, 
      { 
        x: 40, 
        opacity: 0, 
        scale: 0.98, 
      }, 
      { 
        x: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        ease: "power4.out", 
      }, 
      "-=0.5" 
    ); 
 
    gsap.to(".login-orb-1", { 
      x: 20, 
      y: -20, 
      duration: 4, 
      repeat: -1, 
      yoyo: true, 
      ease: "sine.inOut", 
    }); 
 
    gsap.to(".login-orb-2", { 
      x: -20, 
      y: 20, 
      duration: 5, 
      repeat: -1, 
      yoyo: true, 
      ease: "sine.inOut", 
    }); 
  }, []); 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
 
    setLoading(true); 
    setError(""); 
 
    try { 
      const data = await login(email, password); 
 
      const loggedInUser = data?.user || data; 
 
      if (loggedInUser?.role === "admin") { 
        navigate("/admin"); 
      } else { 
        navigate("/"); 
      } 
    } catch (err) { 
      setError( 
        err?.response?.data?.error || 
          err?.response?.data?.message || 
          err?.message || 
          "Invalid email or password" 
      ); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  return ( 
    <div 
      ref={containerRef} 
      className=" 
        relative min-h-screen overflow-hidden 
        bg-[#08070D] 
        px-5 pb-16 pt-32 
        text-white 
        md:px-8 
      " 
    > 
      {/* Background */} 
 
      <div 
        className=" 
          absolute inset-0 
          bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(79,70,229,0.10),transparent_30%)] 
        " 
      /> 
 
      <div className="login-orb-1 absolute left-[-100px] top-32 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" /> 
 
      <div className="login-orb-2 absolute bottom-10 right-[-100px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" /> 
 
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-170px)] max-w-6xl items-center gap-12 lg:grid-cols-2"> 
 
        {/* LEFT SIDE */} 
 
        <div 
          ref={leftRef} 
          className="hidden lg:block" 
        > 
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.07] px-4 py-2 text-xs font-medium text-violet-300"> 
            <FaShieldAlt size={11} /> 
            Welcome back to Eventzo 
          </div> 
 
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#F3F0F8] xl:text-6xl"> 
            Your next 
            <span className="mt-2 block bg-gradient-to-r from-violet-300 via-violet-500 to-indigo-400 bg-clip-text text-transparent"> 
              experience awaits. 
            </span> 
          </h1> 
 
          <p className="mt-6 max-w-lg text-base leading-7 text-[#858091]"> 
            Sign in to discover upcoming events, manage your bookings, 
            and never miss an experience worth remembering. 
          </p> 
 
          <div className="mt-9 space-y-4"> 
 
            <div className="flex items-center gap-3 text-sm text-[#A7A1B2]"> 
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"> 
                <FaCheckCircle size={13} /> 
              </div> 
              Discover amazing events 
            </div> 
 
            <div className="flex items-center gap-3 text-sm text-[#A7A1B2]"> 
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"> 
                <FaCheckCircle size={13} /> 
              </div> 
              Manage your bookings 
            </div> 
 
            <div className="flex items-center gap-3 text-sm text-[#A7A1B2]"> 
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"> 
                <FaCheckCircle size={13} /> 
              </div> 
              Secure account access 
            </div> 
 
          </div> 
 
          <div className="mt-12 flex items-center gap-3"> 
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"> 
              <FaTicketAlt size={17} /> 
            </div> 
 
            <div> 
              <p className="text-sm font-semibold text-[#EAE6F0]"> 
                Eventzo 
              </p> 
 
              <p className="text-xs text-[#686173]"> 
                Experiences worth remembering 
              </p> 
            </div> 
          </div> 
        </div> 
 
        {/* LOGIN CARD */} 
 
        <div 
          ref={rightRef} 
          className="mx-auto w-full max-w-md lg:ml-auto" 
        > 
          <div 
            className=" 
              rounded-[28px] 
              border border-white/[0.08] 
              bg-[#100E17]/80 
              p-6 
              shadow-2xl 
              shadow-black/30 
              backdrop-blur-2xl 
              sm:p-8 
            " 
          > 
 
            {/* Header */} 
 
            <div className="mb-8"> 
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"> 
                <FaLock size={16} /> 
              </div> 
 
              <h2 className="text-2xl font-semibold text-[#F1EDF5]"> 
                Welcome back 
              </h2> 
 
              <p className="mt-2 text-sm leading-6 text-[#797282]"> 
                Sign in to continue to your Eventzo account. 
              </p> 
            </div> 
 
            {/* Error */} 
 
            {error && ( 
              <div className="mb-5 rounded-xl border border-red-500/15 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400"> 
                {error} 
              </div> 
            )} 
 
            {/* Form */} 
 
            <form 
              onSubmit={handleSubmit} 
              className="space-y-5" 
            > 
 
              {/* Email */} 
 
              <div> 
                <label className="mb-2 block text-xs font-medium text-[#A7A1B0]"> 
                  Email address 
                </label> 
 
                <div className="relative"> 
                  <FaEnvelope 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#635C6E]" 
                    size={13} 
                  /> 
 
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required 
                    className=" 
                      h-12 w-full rounded-xl 
                      border border-white/[0.07] 
                      bg-white/[0.025] 
                      pl-11 pr-4 
                      text-sm text-white 
                      outline-none 
                      placeholder:text-[#5F5969] 
                      transition 
                      focus:border-violet-500/40 
                      focus:bg-violet-500/[0.03] 
                      focus:ring-2 
                      focus:ring-violet-500/10 
                    " 
                  /> 
                </div> 
              </div> 
 
              {/* Password */} 
 
              <div> 
                <label className="mb-2 block text-xs font-medium text-[#A7A1B0]"> 
                  Password 
                </label> 
 
                <div className="relative"> 
                  <FaLock 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#635C6E]" 
                    size={13} 
                  /> 
 
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password" 
                    required 
                    className=" 
                      h-12 w-full rounded-xl 
                      border border-white/[0.07] 
                      bg-white/[0.025] 
                      pl-11 pr-4 
                      text-sm text-white 
                      outline-none 
                      placeholder:text-[#5F5969] 
                      transition 
                      focus:border-violet-500/40 
                      focus:bg-violet-500/[0.03] 
                      focus:ring-2 
                      focus:ring-violet-500/10 
                    " 
                  /> 
                </div> 
              </div> 
 
              {/* Login Button */} 
 
              <button 
                type="submit" 
                disabled={loading} 
                className=" 
                  group flex h-12 w-full 
                  items-center justify-center gap-2 
                  rounded-xl 
                  bg-gradient-to-r 
                  from-violet-600 to-indigo-600 
                  text-sm font-semibold text-white 
                  shadow-lg shadow-violet-600/15 
                  transition-all duration-300 
                  hover:-translate-y-0.5 
                  hover:shadow-violet-600/30 
                  disabled:cursor-not-allowed 
                  disabled:opacity-60 
                " 
              > 
                {loading ? ( 
                  <> 
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> 
                    Signing in... 
                  </> 
                ) : ( 
                  <> 
                    Sign in 
                    <FaArrowRight 
                      size={12} 
                      className="transition-transform duration-300 group-hover:translate-x-1" 
                    /> 
                  </> 
                )} 
              </button> 
 
            </form> 
 
            {/* Register */} 
 
            <div className="mt-7 border-t border-white/[0.06] pt-6 text-center"> 
              <p className="text-sm text-[#736D7D]"> 
                Don't have an account? 
              </p> 
 
              <Link 
                to="/register" 
                className=" 
                  mt-2 inline-block 
                  text-sm font-medium 
                  text-violet-400 
                  transition 
                  hover:text-violet-300 
                " 
              > 
                Create an account 
              </Link> 
            </div> 
 
          </div> 
        </div> 
 
      </div> 
    </div> 
  ); 
}; 
 
export default Login; 
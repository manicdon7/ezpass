import { useState } from 'react';
import Connect from '../pages/Connect';

function NavLink({ to, children }) {
    return <a href={to} className={`mx-4`}>
        {children}
    </a>
}

function MobileNav({ open, setOpen }) {
    const [userEmail, setUserEmail] = useState(null);
    return (
        <div className={`absolute top-0 left-0 h-screen w-screen font-Arvo bg-gray-900 transform ${open ? "-translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
            <div className="flex items-center justify-center filter drop-shadow-md bg-gray-900 h-20">
                <a className="md:text-xl text-lg font-semibold text-white" href="/">🎟️EasyPass</a>
            </div>
            <div className="flex flex-col ml-4">
                <a className="text-xl font-normal my-4 text-white" href="/" onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
                    Home
                </a>
                <a className="text-xl font-normal my-4 text-white" href="/Dashboard" onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
                    Dashboard
                </a>
                <a className="text-xl font-normal my-4 text-white" href="/host" onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
                    Host
                </a>
                <a className="text-xl font-normal my-4 text-white" href="/events" onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
                    Events
                </a>
                <Connect setUserEmail={setUserEmail} />
            </div>
        </div>
    )
}

export default function ParentComponent() {
    const [userEmail, setUserEmail] = useState(null);
    const [open, setOpen] = useState(false)
    return (
        <nav className="flex justify-center filter drop-shadow-md font-Arvo bg-gray-900 px-4 py-4 h-20 items-center text-white">
            <MobileNav open={open} setOpen={setOpen} />
            <div className="md:w-3/12 w-3/6 flex items-center">
                <a className="md:text-2xl text-xl font-semibold" href="/">🎟️EasyPass</a>
            </div>
            <div className="w-8/12 flex justify-end items-center">

                <div className="z-50 flex relative w-8 h-8 flex-col justify-center items-center md:hidden" onClick={() => {
                    setOpen(!open)
                }}>
                    {/* hamburger button */}
                    <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${open ? "rotate-45 translate-y-3.5" : ""}`} />
                    <span className={`h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out ${open ? "w-0" : "w-full"}`} />
                    <span className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-3.5" : ""}`} />
                </div>

                <div className="hidden md:flex justify-center">
                    <NavLink to="/">
                        HOME
                    </NavLink>
                    <NavLink to="/Dashboard">
                        DASHBOARD
                    </NavLink>
                    <NavLink to="/host">
                        HOST
                    </NavLink>
                    <NavLink to="/events">
                        EVENTS
                    </NavLink>
                    <div className='-my-4'>
                        {/* {userEmail && (
                            <span className="text-sm md:text-lg">{userEmail}</span>
                        )} */}
                        <Connect setUserEmail={setUserEmail} />
                    </div>
                </div>
            </div>

        </nav>
    )
}
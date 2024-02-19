import Bg from "../assets/lp.png";

const bg = {
    backgroundImage: `url(${Bg})`,
    backgroundSize: "cover",
}

const Home = () => {
    return (
        <div className="h-screen play-font" style={bg}> 
            <main className="grid md:grid-cols-2">
                <div className="text-white font-semibold mt-10 md:mt-36 ml-10 poppins-font"> 
                    <h1 className="text-2xl md:text-7xl"> EasyPass: <span className="bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500 text-transparent bg-clip-text">Festive Passes, Your Way </span></h1>
                    <p className="text-xl md:text-lg  mt-8 mx-2 md:mr-28">Experience seamless event hosting and ticket booking with EasyPass  Embrace the future of ticketing - Your hassle-free ticketing solution!</p>
                    <a href="/events">
                    <button className="bg-white text-black mt-10 font-bold text-xl px-3 border-2 py-2 rounded-full hover:bg-black hover:border-2 hover:border-yellow-400 hover:text-yellow-400">Book Now</button>
                    </a>
                    <a href="/host">
                    <button className="md:ml-16 ml-10 text-xl border-2 px-3 py-2 rounded-full hover:text-yellow-400 hover:border-yellow-400 ">Host Now </button>
                    </a>
                </div>
            </main> 
            
        </div>
    );
}

export default Home;
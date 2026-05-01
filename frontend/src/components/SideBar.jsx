import React, { useEffect, useState } from 'react'
import { sidebar } from '../styles/home'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/empty_dp.png"
import { IoSearchSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { serverURL } from '../main.jsx';
import axios from 'axios';
import {
    setUserData,
    setOtherUsers,
    setSelectedUser,
    setSearchData
} from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';

function SideBar() {
    const { userData,
        otherUsers,
        selectedUser,
        onlineUsers,
        searchData } = useSelector(state => state.user)
    const [search, setSearch] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState("")

    const handleLogOut = async () => {
        try {
            const res = await axios.get(
                `${serverURL}/api/auth/logout`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                dispatch(setUserData(null));
                dispatch(setOtherUsers(null));
                navigate("/login");
            } else {
                console.error("Logout failed:", res);
            }
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        }
    }

    const handleSearch = async () => {
        try {
            const result = await axios.get(
                `${serverURL}/api/user/search?query=${searchInput}`,
                { withCredentials: true })
            dispatch(setSearchData(result.data))
            console.log(result.data)
        } catch (error) {
            console.log(`handleSearch error: ${error.message}`)
        }
    }

    useEffect(() => {
        if (searchInput) {
            handleSearch()
        }
    }, [searchInput])

    return (
        <div className={`lg:w-[30%] lg:block ${!selectedUser ? "block" : "hidden"} w-full h-full overflow-hidden bg-slate-200 relative`}>
            <div
                className={sidebar.logout}
                onClick={handleLogOut}
            >
                <BiLogOut className='w-6 h-6' />
            </div>
            {searchInput.length > 0 && <div className='absolute flex items-center w-full bg-white shadow-gray-400 shadow-lg top-62.5 h-125 pt-5 overflow-y-auto flex-col gap-2.5 z-150'>
                {searchData?.map((user) =>
                    <div
                        className='w-[95%] h-17.5 flex items-center gap-5 px-2.5 bg-white border-b-2 border-gray-400 hover:bg-[#92e0f9] cursor-pointer'
                        key={user._id}
                        onClick={() => {
                            dispatch(setSelectedUser(user))
                            setSearchInput("")
                            setSearch(false)
                        }}
                    >
                        <div className='relative rounded-full'>
                            <div className={sidebar.chatlistProfileImageWrapper}
                                key={user._id}
                            >
                                <img
                                    src={user.image || dp}
                                    className={sidebar.otherProfileImage}
                                />
                            </div>
                            {onlineUsers?.includes(user._id) && <span
                                className='w-3 h-3 rounded-full bg-green-300 absolute -right-px -bottom-px'
                            ></span>}

                        </div>
                        <h1 className='text-gray-600 font-semibold text-[15px]'>{user.name || user.userName}</h1>
                    </div>
                )}
            </div>}

            <div className={sidebar.header}>
                <h1 className={sidebar.title}>FluxChat</h1>
                <div className={sidebar.userRow}>
                    <h1 className={sidebar.userName}>Yo, {userData?.name || "User"}</h1>
                    <div className={sidebar.profileImageWrapperM}>
                        <img
                            src={userData.image || dp}
                            className={sidebar.currentProfileImage}
                            onClick={() => navigate("/profile")}
                        />
                    </div>
                </div>
                <div className='w-full flex items-center gap-5'>
                    {!search && <div
                        className={sidebar.searchOffWrapper}
                        onClick={() => setSearch(true)}>
                        <IoSearchSharp className='w-6 h-6' />
                    </div>}

                    {search &&
                        <form className={sidebar.searchOnWrapper}>
                            <IoSearchSharp className='w-6 h-6' />
                            <input
                                type="text"
                                placeholder='search here...'
                                value={searchInput}
                                className='w-full h-full p-2.5 outline-none border-0'
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <IoCloseSharp
                                className='w-6 h-6 cursor-pointer'
                                onClick={() => setSearch(false)} />
                        </form>
                    }
                    {!search && otherUsers?.map((user) => (
                        onlineUsers?.includes(user._id) &&
                        <div
                            className='relative rounded-full cursor-pointer'
                            onClick={() => dispatch(setSelectedUser(user))}
                        >
                            <div className={sidebar.profileImageWrapper}
                                key={user._id}
                            >
                                <img
                                    src={user.image || dp}
                                    className={sidebar.otherProfileImage}
                                />
                            </div>
                            <span
                                className='w-3 h-3 rounded-full bg-green-300 absolute -right-px -bottom-px'
                            ></span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={sidebar.chatlistContainer}>
                {otherUsers?.map((user) => (
                    <div
                        className={sidebar.chatlistItem}
                        key={user._id}
                        onClick={() => dispatch(setSelectedUser(user))}
                    >
                        <div className='relative rounded-full'>
                            <div className={sidebar.chatlistProfileImageWrapper}
                                key={user._id}
                            >
                                <img
                                    src={user.image || dp}
                                    className={sidebar.otherProfileImage}
                                />
                            </div>
                            {onlineUsers?.includes(user._id) && <span
                                className='w-3 h-3 rounded-full bg-green-300 absolute -right-px -bottom-px'
                            ></span>}

                        </div>
                        <h1 className='text-gray-600 font-semibold text-[15px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default SideBar

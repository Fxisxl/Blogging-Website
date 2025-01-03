import { ChangeEvent, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { SignupInput } from "validator-common";
import  axios  from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {

    const navigate = useNavigate();


    //enforcing type from our common library ie validator-common
    const [postInput, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });

    async function sendRequest() {
        //send request here
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type=== "signup" ? "signup": "signin"}`,postInput);
            const jwt = response.data.jwt;
            console.log(jwt);
            localStorage.setItem("token", jwt);
            navigate("/blog/12423");
        }
        catch(e){
            //alert user of error
            alert("Error while signing in");
        }
    }




    return <div className=" h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-bold ">
                        Create An Account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account" : "Already have an account?"}
                        
                        <Link className="pt-2 underline text-blue-500" to={type==="signin"? "/signup" : "/signin"} >
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    {/* will render name only for signup */}
                    {type==="signup" ?<LabelledInput label="Username" placeholder="Fxisxl>>>>>" onChange={(e) => {
                        setPostInputs({
                            ...postInput, //spread operator (this means give me all existing values in postInput and overwrite the name value)
                            //overwrite values below ie new values
                            name: e.target.value,
                        })
                    }} /> : null}

                    <LabelledInput label="Email" placeholder="Username>>>>>" onChange={(e) => {
                        setPostInputs({
                            ...postInput, //spread operator (this means give me all existing values in postInput and overwrite the name value)
                            //overwrite values below ie new values
                            username: e.target.value,
                        })
                    }} />

                    <LabelledInput label="Password" type={"password"} placeholder="Fxisxl>>>>>" onChange={(e) => {
                        setPostInputs({
                            ...postInput, //spread operator (this means give me all existing values in postInput and overwrite the name value)
                            //overwrite values below ie new values
                            password: e.target.value,
                        })
                    }} />

                    <button onClick={sendRequest}  type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type ==="signup"? "Sign up" :"Sign in"}</button>
                </div>
            </div>

        </div>

    </div>
}



interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={placeholder}
            required />
    </div>
}
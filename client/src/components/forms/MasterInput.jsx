import { Input } from 'antd';
import React from 'react'

const MasterInput = ({ type = "text", count = {}, status, value, name, size, onChange, placeholder, error, icon }) => {
    return (
        <div>
            {
                type == "text" ? <Input
                    count={count}
                    status={status}
                    value={value}
                    autoComplete={false}
                    name={name}
                    size={size}
                    onChange={onChange}
                    placeholder={placeholder}
                    prefix={icon}
                />
                    :
                    <Input.Password
                        count={count}
                        status={status}
                        value={value}
                        autoComplete={false}
                        name={name}
                        size={size}
                        onChange={onChange}
                        placeholder={placeholder}
                        prefix={icon}
                    />
            }

            <ul>
                {error && error.map((msg, index) => (
                    <li key={index} className='text-red-500 text-sm'>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default MasterInput
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/solid';
import axios from 'axios';

const UserManagementEditForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const userNameFromUrl = searchParams.get('username');
    const userIDFormUrl = searchParams.get('user_id');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm({
        defaultValues: {
            username: userNameFromUrl || '',
            password: '',
            confirm_password: '',
            user_id: userIDFormUrl || ''
        }
    });

    const password = watch('password');


    const onSubmit = async (data) => {
        try {
            // Only send password fields if they're not empty
            const payload = {
                username: data.username
            };

            if (data.password) {
                payload.password = data.password;
            }
            else{
                payload.password = ''
            }

            payload.user_id = parseInt(data.user_id)


            const response = await axios.put(`${import.meta.env.VITE_NODE_RED}/update_user`, payload);


            if (response.status === 200) {
                navigate('/user-management');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert(`Error updating user: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-title flex flex-col">
            <div className="max-w-md w-full mx-auto mt-8 px-4 ">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
                    <p className="text-gray-500">Update user details below</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Username must be less than 20 characters'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: 'Username can only contain letters, numbers and underscores'
                                    }
                                })}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.username ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="e.g. johndoe"
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password (leave blank to keep current)
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters'
                                    }
                                })}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="######"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                {...register('confirm_password', {
                                    validate: (value) => {
                                        if (password && value !== password) {
                                            return 'Passwords do not match';
                                        }
                                        return true;
                                    }
                                })}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirm_password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="######"
                            />
                            {errors.confirm_password && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirm_password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/user-management')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                Back to users
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                            >
                                <CheckIcon className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserManagementEditForm;
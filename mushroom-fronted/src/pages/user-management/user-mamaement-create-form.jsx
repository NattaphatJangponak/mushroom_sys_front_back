import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/solid';
import axios from 'axios';

const UserManagementCreateForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
            confirm_password: ''
        }
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            const { confirm_password, ...userData } = data;
            const response = await axios.post(`${import.meta.env.VITE_NODE_RED}/create_user`, userData);
            reset();
            navigate('/user-management');

        } catch (error) {
            console.error('Error creating user:', error);
            alert(`Error creating user: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-title flex-col">
            <div className="max-w-md w-full mx-auto mt-8 px-4 ">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
                    <p className="text-gray-500">Enter user details below</p>
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
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters'
                                    }
                                })}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                {...register('confirm_password', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match'
                                })}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirm_password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="••••••••"
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
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserManagementCreateForm;
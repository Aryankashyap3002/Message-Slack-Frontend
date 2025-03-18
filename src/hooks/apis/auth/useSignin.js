import { useMutation } from '@tanstack/react-query';
 
 import { signInRequest } from '@/apis/auth';
 import { toast } from "sonner"
 
 export const useSignin = () => {
     const { isPending, isSuccess, error, mutateAsync: signinMutation } = useMutation({
         mutationFn: signInRequest,
         onSuccess: (data) => {
             console.log('Scuccessfully signed in', data);
             toast.success('Successfully signed up', {
                style: { 
                    textAlign: "center", 
                    color: "white",
                    backgroundColor: "#129903"
                },
                description: 'You will be redirected to the login page in a few seconds',
                // Add this to style the description text
                descriptionStyle: {
                    color: "black"
                }
            });
         },
         onError: (error) => {
             console.error('Failed to sign in', error);
             toast.error('Failed to sign in', {
                description: error.message,
                style: { backgroundColor: "#dc2626", color: "white", textAlign: "center" }, // Custom styling for "destructive" variant
            });
         }
     });
 
     return {
         isPending,
         isSuccess,
         error,
         signinMutation
     };
 };
import { SignupCard } from '@/components/organisms/Auth/SingupCard' 
 
 export const Auth = () => {
     return (
         <div 
             className="h-[100vh] flex items-center justify-center bg-[#5c3B58]"
         >
             <div className="md:h-auto md:w-[420px]">
                 <SignupCard />
             </div>
 
         </div>
     );
 };
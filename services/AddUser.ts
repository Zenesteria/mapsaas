import { auth } from "@/config/firebase/firebaseConfig";
import { guarantor } from "@/types/Schemas/Guarantor";
// import sendMail from "@/util/sendMail";
import { server } from "@/util/Server";
import { uuidv4 } from "@firebase/util";

const addGuarantor = async (
  email: string,
  uid: string,
  guarantors: guarantor[]
) => {
  const uuid = uuidv4();
  const today = new Date();
  const tomorrow = new Date();

  const guarantor: guarantor = {
    firstName: "",
    lastName: "",
    homeAddress: "",
    workAddress: "",
    dateOfBirth: new Date(),
    emailAddress: {
      data: "",
      verified: false,
    },
    phoneNumber: {
      data: "",
      verified: false,
    },
    link: {
      uuid,
      expDate: new Date(tomorrow.setDate(today.getDate() + 1)),
    },
    completed: false,
  };
  const newGuarantor = [...guarantors];

//   if (newGuarantor[0]) {
//     newGuarantor[1] = guarantor;
//     const updateRecord = await (
//       await fetch(`${server}/api/applicant/update/${uid}`, {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify({
//           guarantors: newGuarantor,
//         }),
//       })
//     ).json();

//     const fetchEmail = await fetch(`/api/sendMail`, {
//       method: "POST",
//       headers: {
//         "Content-type": "appication/json",
//       },
//       body: JSON.stringify({
//         email,
//         subject: `${email} - DreMaS`,
//         body: `LINK: ${server}/dashboard/${
//           auth.currentUser?.uid
//         }/guarantors/${uuid}`,
//       }),
//     });

//     return { msg: "Done" };
//   }

  newGuarantor.push(guarantor);
  console.log(uid)
  const updateRecord = await (
    await fetch(`${server}/api/applicant/update/${uid}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        guarantors: newGuarantor,
      }),
    })
  ).json();

//   const fetchEmail = await fetch(`/api/sendMail`, {
//     method: "POST",
//     headers: {
//       "Content-type": "appication/json",
//     },
//     body: JSON.stringify({
//       email,
//       subject: `${email} - DreMaS`,
//       body: `LINK: ${server}/dashboard/${
//         auth.currentUser?.uid
//       }/guarantors/${uuid}`,
//     }),
//   });

  return { msg: "Done" };
};

export default addGuarantor;

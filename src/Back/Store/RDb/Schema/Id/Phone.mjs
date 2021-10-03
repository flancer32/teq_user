/**
 *  'user_id_phone' entity.
 */
class Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone {
    phone;
    user_ref;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.A_PHONE = 'phone';
Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.A_USER_REF = 'user_ref';
Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone.ENTITY = 'user_id_phone';


// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone);

// MODULE'S EXPORT
export default Fl32_Teq_User_Back_Store_RDb_Schema_Id_Phone;

/**
 *  'user' entity (registry)
 */
class Fl32_Teq_User_Back_Store_RDb_Schema_User {
    date_created;
    id;
}

// table name and columns names (entity and attributes) to use in queries to RDb
Fl32_Teq_User_Back_Store_RDb_Schema_User.A_DATE_CREATED = 'date_created';
Fl32_Teq_User_Back_Store_RDb_Schema_User.A_ID = 'id';
Fl32_Teq_User_Back_Store_RDb_Schema_User.ENTITY = 'user';

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Back_Store_RDb_Schema_User);

// MODULE'S EXPORT
export default Fl32_Teq_User_Back_Store_RDb_Schema_User;

/**
 *  'user_ref_tree' entity.
 */
class Fl32_Teq_User_Store_RDb_Schema_Ref_Tree {
    parent_ref;
    user_ref;
}

Fl32_Teq_User_Store_RDb_Schema_Ref_Tree.A_PARENT_REF = 'parent_ref';
Fl32_Teq_User_Store_RDb_Schema_Ref_Tree.A_USER_REF = 'user_ref';
Fl32_Teq_User_Store_RDb_Schema_Ref_Tree.ENTITY = 'user_ref_tree';

// freeze class to deny attributes changes
Object.freeze(Fl32_Teq_User_Store_RDb_Schema_Ref_Tree);

// MODULE'S EXPORT
export default Fl32_Teq_User_Store_RDb_Schema_Ref_Tree;

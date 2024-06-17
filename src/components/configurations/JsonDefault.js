export const Loading = ({title}) => {
    return {
        title: title,
        message: 'Procesando...',
        statusCode: 1,
        loading: true,
        modalSize: 'md',
        onView:true,
        onHide: null
    }
}

export const LogsConfig = () => {
    return {
        path: '',
        nameCourse: '',
        nameHierarchy: '',
        nameUsers: '',
        namePeriods: '',
        nameCourseNode: '',
        nameUsersNode: '',
        nameUsersCourse: '',
        nameUsersCourseManual: '',
    }
}

export const RolesConfig = () => {
    return {
        roleStudent:'',
        roleTeacherEdit:'',
        roleTeacher:'',
        roleTeacherAssistant:'',
    }
}
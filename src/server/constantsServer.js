 const jsonCreateUserBlackBoard = {
  externalId: "",
  dataSourceId: "_172_1",
  userName: "",
  studentId: "",
  password: "",
  institutionRoleIds: [],
  systemRoleIds: [],
  availability: {
    available: "Yes",
  },
  name: {
    given: "",
    family: "",
    preferredDisplayName: "GivenName",
  },
  address: {
    city: "",
  },
  contact: {
    email: "",
    institutionEmail: "",
  },
};

const systemRoles = [
  {
    id: "CourseSupport",
    name: "Soporte",
  },
];

module.exports = {jsonCreateUserBlackBoard, systemRoles};

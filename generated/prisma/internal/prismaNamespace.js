"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.NotificationScalarFieldEnum = exports.StudentDocumentScalarFieldEnum = exports.ApplicationScalarFieldEnum = exports.SavedScholarshipScalarFieldEnum = exports.ScholarshipScalarFieldEnum = exports.StudentProfileScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    StudentProfile: 'StudentProfile',
    Scholarship: 'Scholarship',
    SavedScholarship: 'SavedScholarship',
    Application: 'Application',
    StudentDocument: 'StudentDocument',
    Notification: 'Notification'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    googleId: 'googleId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StudentProfileScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    state: 'state',
    district: 'district',
    ruralUrban: 'ruralUrban',
    college: 'college',
    course: 'course',
    branch: 'branch',
    yearOfStudy: 'yearOfStudy',
    semester: 'semester',
    currentPercentage: 'currentPercentage',
    currentCGPA: 'currentCGPA',
    previousQualification: 'previousQualification',
    previousPercentage: 'previousPercentage',
    annualFamilyIncome: 'annualFamilyIncome',
    incomeCertificate: 'incomeCertificate',
    ews: 'ews',
    dependents: 'dependents',
    category: 'category',
    disabilityStatus: 'disabilityStatus',
    additionalInfo: 'additionalInfo'
};
exports.ScholarshipScalarFieldEnum = {
    id: 'id',
    name: 'name',
    provider: 'provider',
    description: 'description',
    amount: 'amount',
    startDate: 'startDate',
    deadline: 'deadline',
    educationLevel: 'educationLevel',
    course: 'course',
    branch: 'branch',
    state: 'state',
    incomeLimit: 'incomeLimit',
    applicationUrl: 'applicationUrl',
    source: 'source',
    verified: 'verified',
    lastVerified: 'lastVerified',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SavedScholarshipScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    scholarshipId: 'scholarshipId',
    createdAt: 'createdAt'
};
exports.ApplicationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    scholarshipId: 'scholarshipId',
    status: 'status',
    referenceNo: 'referenceNo',
    submissionDate: 'submissionDate',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StudentDocumentScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    type: 'type',
    url: 'url',
    expiryDate: 'expiryDate',
    createdAt: 'createdAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    read: 'read',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map
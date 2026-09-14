import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type StudentDocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$StudentDocumentPayload>;
export type AggregateStudentDocument = {
    _count: StudentDocumentCountAggregateOutputType | null;
    _min: StudentDocumentMinAggregateOutputType | null;
    _max: StudentDocumentMaxAggregateOutputType | null;
};
export type StudentDocumentMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: string | null;
    url: string | null;
    expiryDate: Date | null;
    createdAt: Date | null;
};
export type StudentDocumentMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    name: string | null;
    type: string | null;
    url: string | null;
    expiryDate: Date | null;
    createdAt: Date | null;
};
export type StudentDocumentCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    type: number;
    url: number;
    expiryDate: number;
    createdAt: number;
    _all: number;
};
export type StudentDocumentMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    url?: true;
    expiryDate?: true;
    createdAt?: true;
};
export type StudentDocumentMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    url?: true;
    expiryDate?: true;
    createdAt?: true;
};
export type StudentDocumentCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    type?: true;
    url?: true;
    expiryDate?: true;
    createdAt?: true;
    _all?: true;
};
export type StudentDocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentDocumentWhereInput;
    orderBy?: Prisma.StudentDocumentOrderByWithRelationInput | Prisma.StudentDocumentOrderByWithRelationInput[];
    cursor?: Prisma.StudentDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StudentDocumentCountAggregateInputType;
    _min?: StudentDocumentMinAggregateInputType;
    _max?: StudentDocumentMaxAggregateInputType;
};
export type GetStudentDocumentAggregateType<T extends StudentDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateStudentDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStudentDocument[P]> : Prisma.GetScalarType<T[P], AggregateStudentDocument[P]>;
};
export type StudentDocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentDocumentWhereInput;
    orderBy?: Prisma.StudentDocumentOrderByWithAggregationInput | Prisma.StudentDocumentOrderByWithAggregationInput[];
    by: Prisma.StudentDocumentScalarFieldEnum[] | Prisma.StudentDocumentScalarFieldEnum;
    having?: Prisma.StudentDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StudentDocumentCountAggregateInputType | true;
    _min?: StudentDocumentMinAggregateInputType;
    _max?: StudentDocumentMaxAggregateInputType;
};
export type StudentDocumentGroupByOutputType = {
    id: string;
    userId: string;
    name: string;
    type: string;
    url: string;
    expiryDate: Date | null;
    createdAt: Date;
    _count: StudentDocumentCountAggregateOutputType | null;
    _min: StudentDocumentMinAggregateOutputType | null;
    _max: StudentDocumentMaxAggregateOutputType | null;
};
export type GetStudentDocumentGroupByPayload<T extends StudentDocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StudentDocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StudentDocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StudentDocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StudentDocumentGroupByOutputType[P]>;
}>>;
export type StudentDocumentWhereInput = {
    AND?: Prisma.StudentDocumentWhereInput | Prisma.StudentDocumentWhereInput[];
    OR?: Prisma.StudentDocumentWhereInput[];
    NOT?: Prisma.StudentDocumentWhereInput | Prisma.StudentDocumentWhereInput[];
    id?: Prisma.StringFilter<"StudentDocument"> | string;
    userId?: Prisma.StringFilter<"StudentDocument"> | string;
    name?: Prisma.StringFilter<"StudentDocument"> | string;
    type?: Prisma.StringFilter<"StudentDocument"> | string;
    url?: Prisma.StringFilter<"StudentDocument"> | string;
    expiryDate?: Prisma.DateTimeNullableFilter<"StudentDocument"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StudentDocument"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type StudentDocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type StudentDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StudentDocumentWhereInput | Prisma.StudentDocumentWhereInput[];
    OR?: Prisma.StudentDocumentWhereInput[];
    NOT?: Prisma.StudentDocumentWhereInput | Prisma.StudentDocumentWhereInput[];
    userId?: Prisma.StringFilter<"StudentDocument"> | string;
    name?: Prisma.StringFilter<"StudentDocument"> | string;
    type?: Prisma.StringFilter<"StudentDocument"> | string;
    url?: Prisma.StringFilter<"StudentDocument"> | string;
    expiryDate?: Prisma.DateTimeNullableFilter<"StudentDocument"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StudentDocument"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type StudentDocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.StudentDocumentCountOrderByAggregateInput;
    _max?: Prisma.StudentDocumentMaxOrderByAggregateInput;
    _min?: Prisma.StudentDocumentMinOrderByAggregateInput;
};
export type StudentDocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.StudentDocumentScalarWhereWithAggregatesInput | Prisma.StudentDocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.StudentDocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StudentDocumentScalarWhereWithAggregatesInput | Prisma.StudentDocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StudentDocument"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"StudentDocument"> | string;
    name?: Prisma.StringWithAggregatesFilter<"StudentDocument"> | string;
    type?: Prisma.StringWithAggregatesFilter<"StudentDocument"> | string;
    url?: Prisma.StringWithAggregatesFilter<"StudentDocument"> | string;
    expiryDate?: Prisma.DateTimeNullableWithAggregatesFilter<"StudentDocument"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StudentDocument"> | Date | string;
};
export type StudentDocumentCreateInput = {
    id?: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDocumentsInput;
};
export type StudentDocumentUncheckedCreateInput = {
    id?: string;
    userId: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
};
export type StudentDocumentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDocumentsNestedInput;
};
export type StudentDocumentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentCreateManyInput = {
    id?: string;
    userId: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
};
export type StudentDocumentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentListRelationFilter = {
    every?: Prisma.StudentDocumentWhereInput;
    some?: Prisma.StudentDocumentWhereInput;
    none?: Prisma.StudentDocumentWhereInput;
};
export type StudentDocumentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StudentDocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StudentDocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StudentDocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    expiryDate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StudentDocumentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput> | Prisma.StudentDocumentCreateWithoutUserInput[] | Prisma.StudentDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StudentDocumentCreateOrConnectWithoutUserInput | Prisma.StudentDocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StudentDocumentCreateManyUserInputEnvelope;
    connect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
};
export type StudentDocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput> | Prisma.StudentDocumentCreateWithoutUserInput[] | Prisma.StudentDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StudentDocumentCreateOrConnectWithoutUserInput | Prisma.StudentDocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StudentDocumentCreateManyUserInputEnvelope;
    connect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
};
export type StudentDocumentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput> | Prisma.StudentDocumentCreateWithoutUserInput[] | Prisma.StudentDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StudentDocumentCreateOrConnectWithoutUserInput | Prisma.StudentDocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StudentDocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.StudentDocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StudentDocumentCreateManyUserInputEnvelope;
    set?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    disconnect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    delete?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    connect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    update?: Prisma.StudentDocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.StudentDocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StudentDocumentUpdateManyWithWhereWithoutUserInput | Prisma.StudentDocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StudentDocumentScalarWhereInput | Prisma.StudentDocumentScalarWhereInput[];
};
export type StudentDocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput> | Prisma.StudentDocumentCreateWithoutUserInput[] | Prisma.StudentDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StudentDocumentCreateOrConnectWithoutUserInput | Prisma.StudentDocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StudentDocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.StudentDocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StudentDocumentCreateManyUserInputEnvelope;
    set?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    disconnect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    delete?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    connect?: Prisma.StudentDocumentWhereUniqueInput | Prisma.StudentDocumentWhereUniqueInput[];
    update?: Prisma.StudentDocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.StudentDocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StudentDocumentUpdateManyWithWhereWithoutUserInput | Prisma.StudentDocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StudentDocumentScalarWhereInput | Prisma.StudentDocumentScalarWhereInput[];
};
export type StudentDocumentCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
};
export type StudentDocumentUncheckedCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
};
export type StudentDocumentCreateOrConnectWithoutUserInput = {
    where: Prisma.StudentDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput>;
};
export type StudentDocumentCreateManyUserInputEnvelope = {
    data: Prisma.StudentDocumentCreateManyUserInput | Prisma.StudentDocumentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type StudentDocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.StudentDocumentWhereUniqueInput;
    update: Prisma.XOR<Prisma.StudentDocumentUpdateWithoutUserInput, Prisma.StudentDocumentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.StudentDocumentCreateWithoutUserInput, Prisma.StudentDocumentUncheckedCreateWithoutUserInput>;
};
export type StudentDocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.StudentDocumentWhereUniqueInput;
    data: Prisma.XOR<Prisma.StudentDocumentUpdateWithoutUserInput, Prisma.StudentDocumentUncheckedUpdateWithoutUserInput>;
};
export type StudentDocumentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.StudentDocumentScalarWhereInput;
    data: Prisma.XOR<Prisma.StudentDocumentUpdateManyMutationInput, Prisma.StudentDocumentUncheckedUpdateManyWithoutUserInput>;
};
export type StudentDocumentScalarWhereInput = {
    AND?: Prisma.StudentDocumentScalarWhereInput | Prisma.StudentDocumentScalarWhereInput[];
    OR?: Prisma.StudentDocumentScalarWhereInput[];
    NOT?: Prisma.StudentDocumentScalarWhereInput | Prisma.StudentDocumentScalarWhereInput[];
    id?: Prisma.StringFilter<"StudentDocument"> | string;
    userId?: Prisma.StringFilter<"StudentDocument"> | string;
    name?: Prisma.StringFilter<"StudentDocument"> | string;
    type?: Prisma.StringFilter<"StudentDocument"> | string;
    url?: Prisma.StringFilter<"StudentDocument"> | string;
    expiryDate?: Prisma.DateTimeNullableFilter<"StudentDocument"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"StudentDocument"> | Date | string;
};
export type StudentDocumentCreateManyUserInput = {
    id?: string;
    name: string;
    type: string;
    url: string;
    expiryDate?: Date | string | null;
    createdAt?: Date | string;
};
export type StudentDocumentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    expiryDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StudentDocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    url?: boolean;
    expiryDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentDocument"]>;
export type StudentDocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    url?: boolean;
    expiryDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentDocument"]>;
export type StudentDocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    url?: boolean;
    expiryDate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["studentDocument"]>;
export type StudentDocumentSelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    url?: boolean;
    expiryDate?: boolean;
    createdAt?: boolean;
};
export type StudentDocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "name" | "type" | "url" | "expiryDate" | "createdAt", ExtArgs["result"]["studentDocument"]>;
export type StudentDocumentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StudentDocumentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StudentDocumentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $StudentDocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StudentDocument";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        name: string;
        type: string;
        url: string;
        expiryDate: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["studentDocument"]>;
    composites: {};
};
export type StudentDocumentGetPayload<S extends boolean | null | undefined | StudentDocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload, S>;
export type StudentDocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StudentDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StudentDocumentCountAggregateInputType | true;
};
export interface StudentDocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StudentDocument'];
        meta: {
            name: 'StudentDocument';
        };
    };
    findUnique<T extends StudentDocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, StudentDocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StudentDocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StudentDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StudentDocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, StudentDocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StudentDocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StudentDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StudentDocumentFindManyArgs>(args?: Prisma.SelectSubset<T, StudentDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StudentDocumentCreateArgs>(args: Prisma.SelectSubset<T, StudentDocumentCreateArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StudentDocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, StudentDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StudentDocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StudentDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StudentDocumentDeleteArgs>(args: Prisma.SelectSubset<T, StudentDocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StudentDocumentUpdateArgs>(args: Prisma.SelectSubset<T, StudentDocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StudentDocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, StudentDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StudentDocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, StudentDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StudentDocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StudentDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StudentDocumentUpsertArgs>(args: Prisma.SelectSubset<T, StudentDocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__StudentDocumentClient<runtime.Types.Result.GetResult<Prisma.$StudentDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StudentDocumentCountArgs>(args?: Prisma.Subset<T, StudentDocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StudentDocumentCountAggregateOutputType> : number>;
    aggregate<T extends StudentDocumentAggregateArgs>(args: Prisma.Subset<T, StudentDocumentAggregateArgs>): Prisma.PrismaPromise<GetStudentDocumentAggregateType<T>>;
    groupBy<T extends StudentDocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StudentDocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: StudentDocumentGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StudentDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StudentDocumentFieldRefs;
}
export interface Prisma__StudentDocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StudentDocumentFieldRefs {
    readonly id: Prisma.FieldRef<"StudentDocument", 'String'>;
    readonly userId: Prisma.FieldRef<"StudentDocument", 'String'>;
    readonly name: Prisma.FieldRef<"StudentDocument", 'String'>;
    readonly type: Prisma.FieldRef<"StudentDocument", 'String'>;
    readonly url: Prisma.FieldRef<"StudentDocument", 'String'>;
    readonly expiryDate: Prisma.FieldRef<"StudentDocument", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"StudentDocument", 'DateTime'>;
}
export type StudentDocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where: Prisma.StudentDocumentWhereUniqueInput;
};
export type StudentDocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where: Prisma.StudentDocumentWhereUniqueInput;
};
export type StudentDocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where?: Prisma.StudentDocumentWhereInput;
    orderBy?: Prisma.StudentDocumentOrderByWithRelationInput | Prisma.StudentDocumentOrderByWithRelationInput[];
    cursor?: Prisma.StudentDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentDocumentScalarFieldEnum | Prisma.StudentDocumentScalarFieldEnum[];
};
export type StudentDocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where?: Prisma.StudentDocumentWhereInput;
    orderBy?: Prisma.StudentDocumentOrderByWithRelationInput | Prisma.StudentDocumentOrderByWithRelationInput[];
    cursor?: Prisma.StudentDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentDocumentScalarFieldEnum | Prisma.StudentDocumentScalarFieldEnum[];
};
export type StudentDocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where?: Prisma.StudentDocumentWhereInput;
    orderBy?: Prisma.StudentDocumentOrderByWithRelationInput | Prisma.StudentDocumentOrderByWithRelationInput[];
    cursor?: Prisma.StudentDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentDocumentScalarFieldEnum | Prisma.StudentDocumentScalarFieldEnum[];
};
export type StudentDocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentDocumentCreateInput, Prisma.StudentDocumentUncheckedCreateInput>;
};
export type StudentDocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StudentDocumentCreateManyInput | Prisma.StudentDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StudentDocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    data: Prisma.StudentDocumentCreateManyInput | Prisma.StudentDocumentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StudentDocumentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StudentDocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentDocumentUpdateInput, Prisma.StudentDocumentUncheckedUpdateInput>;
    where: Prisma.StudentDocumentWhereUniqueInput;
};
export type StudentDocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StudentDocumentUpdateManyMutationInput, Prisma.StudentDocumentUncheckedUpdateManyInput>;
    where?: Prisma.StudentDocumentWhereInput;
    limit?: number;
};
export type StudentDocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StudentDocumentUpdateManyMutationInput, Prisma.StudentDocumentUncheckedUpdateManyInput>;
    where?: Prisma.StudentDocumentWhereInput;
    limit?: number;
    include?: Prisma.StudentDocumentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StudentDocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where: Prisma.StudentDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.StudentDocumentCreateInput, Prisma.StudentDocumentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StudentDocumentUpdateInput, Prisma.StudentDocumentUncheckedUpdateInput>;
};
export type StudentDocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
    where: Prisma.StudentDocumentWhereUniqueInput;
};
export type StudentDocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentDocumentWhereInput;
    limit?: number;
};
export type StudentDocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentDocumentSelect<ExtArgs> | null;
    omit?: Prisma.StudentDocumentOmit<ExtArgs> | null;
    include?: Prisma.StudentDocumentInclude<ExtArgs> | null;
};

import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
export type SavedScholarshipModel = runtime.Types.Result.DefaultSelection<Prisma.$SavedScholarshipPayload>;
export type AggregateSavedScholarship = {
    _count: SavedScholarshipCountAggregateOutputType | null;
    _min: SavedScholarshipMinAggregateOutputType | null;
    _max: SavedScholarshipMaxAggregateOutputType | null;
};
export type SavedScholarshipMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    scholarshipId: string | null;
    createdAt: Date | null;
};
export type SavedScholarshipMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    scholarshipId: string | null;
    createdAt: Date | null;
};
export type SavedScholarshipCountAggregateOutputType = {
    id: number;
    userId: number;
    scholarshipId: number;
    createdAt: number;
    _all: number;
};
export type SavedScholarshipMinAggregateInputType = {
    id?: true;
    userId?: true;
    scholarshipId?: true;
    createdAt?: true;
};
export type SavedScholarshipMaxAggregateInputType = {
    id?: true;
    userId?: true;
    scholarshipId?: true;
    createdAt?: true;
};
export type SavedScholarshipCountAggregateInputType = {
    id?: true;
    userId?: true;
    scholarshipId?: true;
    createdAt?: true;
    _all?: true;
};
export type SavedScholarshipAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedScholarshipWhereInput;
    orderBy?: Prisma.SavedScholarshipOrderByWithRelationInput | Prisma.SavedScholarshipOrderByWithRelationInput[];
    cursor?: Prisma.SavedScholarshipWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SavedScholarshipCountAggregateInputType;
    _min?: SavedScholarshipMinAggregateInputType;
    _max?: SavedScholarshipMaxAggregateInputType;
};
export type GetSavedScholarshipAggregateType<T extends SavedScholarshipAggregateArgs> = {
    [P in keyof T & keyof AggregateSavedScholarship]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSavedScholarship[P]> : Prisma.GetScalarType<T[P], AggregateSavedScholarship[P]>;
};
export type SavedScholarshipGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedScholarshipWhereInput;
    orderBy?: Prisma.SavedScholarshipOrderByWithAggregationInput | Prisma.SavedScholarshipOrderByWithAggregationInput[];
    by: Prisma.SavedScholarshipScalarFieldEnum[] | Prisma.SavedScholarshipScalarFieldEnum;
    having?: Prisma.SavedScholarshipScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SavedScholarshipCountAggregateInputType | true;
    _min?: SavedScholarshipMinAggregateInputType;
    _max?: SavedScholarshipMaxAggregateInputType;
};
export type SavedScholarshipGroupByOutputType = {
    id: string;
    userId: string;
    scholarshipId: string;
    createdAt: Date;
    _count: SavedScholarshipCountAggregateOutputType | null;
    _min: SavedScholarshipMinAggregateOutputType | null;
    _max: SavedScholarshipMaxAggregateOutputType | null;
};
export type GetSavedScholarshipGroupByPayload<T extends SavedScholarshipGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SavedScholarshipGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SavedScholarshipGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SavedScholarshipGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SavedScholarshipGroupByOutputType[P]>;
}>>;
export type SavedScholarshipWhereInput = {
    AND?: Prisma.SavedScholarshipWhereInput | Prisma.SavedScholarshipWhereInput[];
    OR?: Prisma.SavedScholarshipWhereInput[];
    NOT?: Prisma.SavedScholarshipWhereInput | Prisma.SavedScholarshipWhereInput[];
    id?: Prisma.StringFilter<"SavedScholarship"> | string;
    userId?: Prisma.StringFilter<"SavedScholarship"> | string;
    scholarshipId?: Prisma.StringFilter<"SavedScholarship"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedScholarship"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    scholarship?: Prisma.XOR<Prisma.ScholarshipScalarRelationFilter, Prisma.ScholarshipWhereInput>;
};
export type SavedScholarshipOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scholarshipId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    scholarship?: Prisma.ScholarshipOrderByWithRelationInput;
};
export type SavedScholarshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_scholarshipId?: Prisma.SavedScholarshipUserIdScholarshipIdCompoundUniqueInput;
    AND?: Prisma.SavedScholarshipWhereInput | Prisma.SavedScholarshipWhereInput[];
    OR?: Prisma.SavedScholarshipWhereInput[];
    NOT?: Prisma.SavedScholarshipWhereInput | Prisma.SavedScholarshipWhereInput[];
    userId?: Prisma.StringFilter<"SavedScholarship"> | string;
    scholarshipId?: Prisma.StringFilter<"SavedScholarship"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedScholarship"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    scholarship?: Prisma.XOR<Prisma.ScholarshipScalarRelationFilter, Prisma.ScholarshipWhereInput>;
}, "id" | "userId_scholarshipId">;
export type SavedScholarshipOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scholarshipId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SavedScholarshipCountOrderByAggregateInput;
    _max?: Prisma.SavedScholarshipMaxOrderByAggregateInput;
    _min?: Prisma.SavedScholarshipMinOrderByAggregateInput;
};
export type SavedScholarshipScalarWhereWithAggregatesInput = {
    AND?: Prisma.SavedScholarshipScalarWhereWithAggregatesInput | Prisma.SavedScholarshipScalarWhereWithAggregatesInput[];
    OR?: Prisma.SavedScholarshipScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SavedScholarshipScalarWhereWithAggregatesInput | Prisma.SavedScholarshipScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SavedScholarship"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"SavedScholarship"> | string;
    scholarshipId?: Prisma.StringWithAggregatesFilter<"SavedScholarship"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SavedScholarship"> | Date | string;
};
export type SavedScholarshipCreateInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedInput;
    scholarship: Prisma.ScholarshipCreateNestedOneWithoutSavedInput;
};
export type SavedScholarshipUncheckedCreateInput = {
    id?: string;
    userId: string;
    scholarshipId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedNestedInput;
    scholarship?: Prisma.ScholarshipUpdateOneRequiredWithoutSavedNestedInput;
};
export type SavedScholarshipUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scholarshipId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipCreateManyInput = {
    id?: string;
    userId: string;
    scholarshipId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scholarshipId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipListRelationFilter = {
    every?: Prisma.SavedScholarshipWhereInput;
    some?: Prisma.SavedScholarshipWhereInput;
    none?: Prisma.SavedScholarshipWhereInput;
};
export type SavedScholarshipOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SavedScholarshipUserIdScholarshipIdCompoundUniqueInput = {
    userId: string;
    scholarshipId: string;
};
export type SavedScholarshipCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scholarshipId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedScholarshipMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scholarshipId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedScholarshipMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scholarshipId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedScholarshipCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput> | Prisma.SavedScholarshipCreateWithoutUserInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutUserInput | Prisma.SavedScholarshipCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedScholarshipCreateManyUserInputEnvelope;
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
};
export type SavedScholarshipUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput> | Prisma.SavedScholarshipCreateWithoutUserInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutUserInput | Prisma.SavedScholarshipCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedScholarshipCreateManyUserInputEnvelope;
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
};
export type SavedScholarshipUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput> | Prisma.SavedScholarshipCreateWithoutUserInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutUserInput | Prisma.SavedScholarshipCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedScholarshipCreateManyUserInputEnvelope;
    set?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    disconnect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    delete?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    update?: Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedScholarshipUpdateManyWithWhereWithoutUserInput | Prisma.SavedScholarshipUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
};
export type SavedScholarshipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput> | Prisma.SavedScholarshipCreateWithoutUserInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutUserInput | Prisma.SavedScholarshipCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedScholarshipCreateManyUserInputEnvelope;
    set?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    disconnect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    delete?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    update?: Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedScholarshipUpdateManyWithWhereWithoutUserInput | Prisma.SavedScholarshipUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
};
export type SavedScholarshipCreateNestedManyWithoutScholarshipInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput> | Prisma.SavedScholarshipCreateWithoutScholarshipInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput | Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput[];
    createMany?: Prisma.SavedScholarshipCreateManyScholarshipInputEnvelope;
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
};
export type SavedScholarshipUncheckedCreateNestedManyWithoutScholarshipInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput> | Prisma.SavedScholarshipCreateWithoutScholarshipInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput | Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput[];
    createMany?: Prisma.SavedScholarshipCreateManyScholarshipInputEnvelope;
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
};
export type SavedScholarshipUpdateManyWithoutScholarshipNestedInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput> | Prisma.SavedScholarshipCreateWithoutScholarshipInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput | Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput[];
    upsert?: Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutScholarshipInput | Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutScholarshipInput[];
    createMany?: Prisma.SavedScholarshipCreateManyScholarshipInputEnvelope;
    set?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    disconnect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    delete?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    update?: Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutScholarshipInput | Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutScholarshipInput[];
    updateMany?: Prisma.SavedScholarshipUpdateManyWithWhereWithoutScholarshipInput | Prisma.SavedScholarshipUpdateManyWithWhereWithoutScholarshipInput[];
    deleteMany?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
};
export type SavedScholarshipUncheckedUpdateManyWithoutScholarshipNestedInput = {
    create?: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput> | Prisma.SavedScholarshipCreateWithoutScholarshipInput[] | Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput[];
    connectOrCreate?: Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput | Prisma.SavedScholarshipCreateOrConnectWithoutScholarshipInput[];
    upsert?: Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutScholarshipInput | Prisma.SavedScholarshipUpsertWithWhereUniqueWithoutScholarshipInput[];
    createMany?: Prisma.SavedScholarshipCreateManyScholarshipInputEnvelope;
    set?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    disconnect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    delete?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    connect?: Prisma.SavedScholarshipWhereUniqueInput | Prisma.SavedScholarshipWhereUniqueInput[];
    update?: Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutScholarshipInput | Prisma.SavedScholarshipUpdateWithWhereUniqueWithoutScholarshipInput[];
    updateMany?: Prisma.SavedScholarshipUpdateManyWithWhereWithoutScholarshipInput | Prisma.SavedScholarshipUpdateManyWithWhereWithoutScholarshipInput[];
    deleteMany?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
};
export type SavedScholarshipCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    scholarship: Prisma.ScholarshipCreateNestedOneWithoutSavedInput;
};
export type SavedScholarshipUncheckedCreateWithoutUserInput = {
    id?: string;
    scholarshipId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipCreateOrConnectWithoutUserInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput>;
};
export type SavedScholarshipCreateManyUserInputEnvelope = {
    data: Prisma.SavedScholarshipCreateManyUserInput | Prisma.SavedScholarshipCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SavedScholarshipUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedScholarshipUpdateWithoutUserInput, Prisma.SavedScholarshipUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutUserInput, Prisma.SavedScholarshipUncheckedCreateWithoutUserInput>;
};
export type SavedScholarshipUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateWithoutUserInput, Prisma.SavedScholarshipUncheckedUpdateWithoutUserInput>;
};
export type SavedScholarshipUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SavedScholarshipScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateManyMutationInput, Prisma.SavedScholarshipUncheckedUpdateManyWithoutUserInput>;
};
export type SavedScholarshipScalarWhereInput = {
    AND?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
    OR?: Prisma.SavedScholarshipScalarWhereInput[];
    NOT?: Prisma.SavedScholarshipScalarWhereInput | Prisma.SavedScholarshipScalarWhereInput[];
    id?: Prisma.StringFilter<"SavedScholarship"> | string;
    userId?: Prisma.StringFilter<"SavedScholarship"> | string;
    scholarshipId?: Prisma.StringFilter<"SavedScholarship"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedScholarship"> | Date | string;
};
export type SavedScholarshipCreateWithoutScholarshipInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedInput;
};
export type SavedScholarshipUncheckedCreateWithoutScholarshipInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipCreateOrConnectWithoutScholarshipInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput>;
};
export type SavedScholarshipCreateManyScholarshipInputEnvelope = {
    data: Prisma.SavedScholarshipCreateManyScholarshipInput | Prisma.SavedScholarshipCreateManyScholarshipInput[];
    skipDuplicates?: boolean;
};
export type SavedScholarshipUpsertWithWhereUniqueWithoutScholarshipInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedScholarshipUpdateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedUpdateWithoutScholarshipInput>;
    create: Prisma.XOR<Prisma.SavedScholarshipCreateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedCreateWithoutScholarshipInput>;
};
export type SavedScholarshipUpdateWithWhereUniqueWithoutScholarshipInput = {
    where: Prisma.SavedScholarshipWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateWithoutScholarshipInput, Prisma.SavedScholarshipUncheckedUpdateWithoutScholarshipInput>;
};
export type SavedScholarshipUpdateManyWithWhereWithoutScholarshipInput = {
    where: Prisma.SavedScholarshipScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateManyMutationInput, Prisma.SavedScholarshipUncheckedUpdateManyWithoutScholarshipInput>;
};
export type SavedScholarshipCreateManyUserInput = {
    id?: string;
    scholarshipId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scholarship?: Prisma.ScholarshipUpdateOneRequiredWithoutSavedNestedInput;
};
export type SavedScholarshipUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scholarshipId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scholarshipId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipCreateManyScholarshipInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
};
export type SavedScholarshipUpdateWithoutScholarshipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedNestedInput;
};
export type SavedScholarshipUncheckedUpdateWithoutScholarshipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipUncheckedUpdateManyWithoutScholarshipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedScholarshipSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scholarshipId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedScholarship"]>;
export type SavedScholarshipSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scholarshipId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedScholarship"]>;
export type SavedScholarshipSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scholarshipId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedScholarship"]>;
export type SavedScholarshipSelectScalar = {
    id?: boolean;
    userId?: boolean;
    scholarshipId?: boolean;
    createdAt?: boolean;
};
export type SavedScholarshipOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "scholarshipId" | "createdAt", ExtArgs["result"]["savedScholarship"]>;
export type SavedScholarshipInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
};
export type SavedScholarshipIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
};
export type SavedScholarshipIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scholarship?: boolean | Prisma.ScholarshipDefaultArgs<ExtArgs>;
};
export type $SavedScholarshipPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SavedScholarship";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        scholarship: Prisma.$ScholarshipPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        scholarshipId: string;
        createdAt: Date;
    }, ExtArgs["result"]["savedScholarship"]>;
    composites: {};
};
export type SavedScholarshipGetPayload<S extends boolean | null | undefined | SavedScholarshipDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload, S>;
export type SavedScholarshipCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SavedScholarshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SavedScholarshipCountAggregateInputType | true;
};
export interface SavedScholarshipDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SavedScholarship'];
        meta: {
            name: 'SavedScholarship';
        };
    };
    findUnique<T extends SavedScholarshipFindUniqueArgs>(args: Prisma.SelectSubset<T, SavedScholarshipFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SavedScholarshipFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SavedScholarshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SavedScholarshipFindFirstArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipFindFirstArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SavedScholarshipFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SavedScholarshipFindManyArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SavedScholarshipCreateArgs>(args: Prisma.SelectSubset<T, SavedScholarshipCreateArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SavedScholarshipCreateManyArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SavedScholarshipCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SavedScholarshipDeleteArgs>(args: Prisma.SelectSubset<T, SavedScholarshipDeleteArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SavedScholarshipUpdateArgs>(args: Prisma.SelectSubset<T, SavedScholarshipUpdateArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SavedScholarshipDeleteManyArgs>(args?: Prisma.SelectSubset<T, SavedScholarshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SavedScholarshipUpdateManyArgs>(args: Prisma.SelectSubset<T, SavedScholarshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SavedScholarshipUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SavedScholarshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SavedScholarshipUpsertArgs>(args: Prisma.SelectSubset<T, SavedScholarshipUpsertArgs<ExtArgs>>): Prisma.Prisma__SavedScholarshipClient<runtime.Types.Result.GetResult<Prisma.$SavedScholarshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SavedScholarshipCountArgs>(args?: Prisma.Subset<T, SavedScholarshipCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SavedScholarshipCountAggregateOutputType> : number>;
    aggregate<T extends SavedScholarshipAggregateArgs>(args: Prisma.Subset<T, SavedScholarshipAggregateArgs>): Prisma.PrismaPromise<GetSavedScholarshipAggregateType<T>>;
    groupBy<T extends SavedScholarshipGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SavedScholarshipGroupByArgs['orderBy'];
    } : {
        orderBy?: SavedScholarshipGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SavedScholarshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedScholarshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SavedScholarshipFieldRefs;
}
export interface Prisma__SavedScholarshipClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scholarship<T extends Prisma.ScholarshipDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScholarshipDefaultArgs<ExtArgs>>): Prisma.Prisma__ScholarshipClient<runtime.Types.Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SavedScholarshipFieldRefs {
    readonly id: Prisma.FieldRef<"SavedScholarship", 'String'>;
    readonly userId: Prisma.FieldRef<"SavedScholarship", 'String'>;
    readonly scholarshipId: Prisma.FieldRef<"SavedScholarship", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SavedScholarship", 'DateTime'>;
}
export type SavedScholarshipFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where: Prisma.SavedScholarshipWhereUniqueInput;
};
export type SavedScholarshipFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where: Prisma.SavedScholarshipWhereUniqueInput;
};
export type SavedScholarshipFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where?: Prisma.SavedScholarshipWhereInput;
    orderBy?: Prisma.SavedScholarshipOrderByWithRelationInput | Prisma.SavedScholarshipOrderByWithRelationInput[];
    cursor?: Prisma.SavedScholarshipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedScholarshipScalarFieldEnum | Prisma.SavedScholarshipScalarFieldEnum[];
};
export type SavedScholarshipFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where?: Prisma.SavedScholarshipWhereInput;
    orderBy?: Prisma.SavedScholarshipOrderByWithRelationInput | Prisma.SavedScholarshipOrderByWithRelationInput[];
    cursor?: Prisma.SavedScholarshipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedScholarshipScalarFieldEnum | Prisma.SavedScholarshipScalarFieldEnum[];
};
export type SavedScholarshipFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where?: Prisma.SavedScholarshipWhereInput;
    orderBy?: Prisma.SavedScholarshipOrderByWithRelationInput | Prisma.SavedScholarshipOrderByWithRelationInput[];
    cursor?: Prisma.SavedScholarshipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedScholarshipScalarFieldEnum | Prisma.SavedScholarshipScalarFieldEnum[];
};
export type SavedScholarshipCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedScholarshipCreateInput, Prisma.SavedScholarshipUncheckedCreateInput>;
};
export type SavedScholarshipCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SavedScholarshipCreateManyInput | Prisma.SavedScholarshipCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SavedScholarshipCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    data: Prisma.SavedScholarshipCreateManyInput | Prisma.SavedScholarshipCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SavedScholarshipIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SavedScholarshipUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateInput, Prisma.SavedScholarshipUncheckedUpdateInput>;
    where: Prisma.SavedScholarshipWhereUniqueInput;
};
export type SavedScholarshipUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateManyMutationInput, Prisma.SavedScholarshipUncheckedUpdateManyInput>;
    where?: Prisma.SavedScholarshipWhereInput;
    limit?: number;
};
export type SavedScholarshipUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedScholarshipUpdateManyMutationInput, Prisma.SavedScholarshipUncheckedUpdateManyInput>;
    where?: Prisma.SavedScholarshipWhereInput;
    limit?: number;
    include?: Prisma.SavedScholarshipIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SavedScholarshipUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where: Prisma.SavedScholarshipWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedScholarshipCreateInput, Prisma.SavedScholarshipUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SavedScholarshipUpdateInput, Prisma.SavedScholarshipUncheckedUpdateInput>;
};
export type SavedScholarshipDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
    where: Prisma.SavedScholarshipWhereUniqueInput;
};
export type SavedScholarshipDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedScholarshipWhereInput;
    limit?: number;
};
export type SavedScholarshipDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedScholarshipSelect<ExtArgs> | null;
    omit?: Prisma.SavedScholarshipOmit<ExtArgs> | null;
    include?: Prisma.SavedScholarshipInclude<ExtArgs> | null;
};

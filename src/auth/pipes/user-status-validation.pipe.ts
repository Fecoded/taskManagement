import { BadRequestException, PipeTransform } from "@nestjs/common";
import { RoleStatus } from "../../enum/enum";

export class UserStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        RoleStatus.ADMIN,
        RoleStatus.USER,
    ];

    transform(value: any) {
        value = value.toUpperCase();

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid role`);
        }

        return value;
    }

    private isStatusValid(role: any) {
        const idx = this.allowedStatuses.indexOf(role);

        return idx !== -1;
    }
}
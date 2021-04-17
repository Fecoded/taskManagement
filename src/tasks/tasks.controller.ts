import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/auth/user.entity';
import { RoleStatus } from 'src/enum/enum';
import { CreateTaskDTO } from './dto/create-task-dto';
import { getTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './tasks-status.enum';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('api/tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDTO: getTaskFilterDTO,
        @GetUser() user: User,
        ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO, user);
    }

    @Get("/:id")
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.tasksService.createTask(createTaskDTO, user)
    };

    @Patch("/:id/status")
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
           return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete("/:id")
    deleteTask(
        @Param('id') id: string,
        @GetUser() user: User
        ): Promise<string> {
        return this.tasksService.deleteTaskById(id, user);
    }
}

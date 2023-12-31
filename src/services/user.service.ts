import { User } from '../db/models/user';
import { AuthError } from '../exceptions/auth-error';
import { DBError } from '../exceptions/db-error';
import { EntityError } from '../exceptions/entity-error';

class UserService {
    async create(user: User) {
        try {
            let { name, vip, email } = user;
            const candidate: User | null = await User.findOne({
                where: { email: email },
            });

            if (candidate) {
                return new AuthError(
                    'User with this email is already registered'
                );
            }
            const newUser: User = await User.create({
                name: name,
                email: email,
                vip: vip,
            });
            return newUser;
        } catch (e: unknown) {
            if (e instanceof DBError) {
                return new DBError('data base error', e);
            } else {
                return new Error('unknown error was occured');
            }
        }
    }

    async getUsers() {
        const users = await User.findAll();
        return users;
    }

    async getUserStatus(id: number) {
        const user = await User.findOne({
            where: { id: id },
        });
        if (!user) {
            return new EntityError(
                `there is no user with id:${id} in data-base`
            );
        }
        return user.vip;
    }

    async deleteUser(id: number) {
        const user = await User.findByPk(id);
        if (!user) {
            return new EntityError(
                `there is no user with id:${id} in data-base`
            );
        }
        await User.destroy({ where: { id } });
    }
}

module.exports = new UserService();

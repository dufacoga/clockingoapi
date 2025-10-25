import { Menu } from '../../domain/entities/Menu';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';

interface CreateMenuInput {
  nameEs: string;
  nameEn: string;
  parentId?: number | null;
  level?: number;
  displayOrder?: number;
}

export default class CreateMenuUseCase {
  private menuRepo: IMenuRepository;

  constructor({ menuRepo }: { menuRepo: IMenuRepository }) {
    this.menuRepo = menuRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute({ nameEs, nameEn, parentId = null, level, displayOrder = 0 }: CreateMenuInput) {
    const normalizedNameEs = nameEs.trim();
    const normalizedNameEn = nameEn.trim();

    if (!normalizedNameEs) {
      throw this.buildError('MENU_INVALID_NAME', 400);
    }

    if (!normalizedNameEn) {
      throw this.buildError('MENU_INVALID_NAME', 400);
    }

    let parent: Menu | null = null;
    if (parentId !== null && parentId !== undefined) {
      parent = await this.menuRepo.findById(parentId);
      if (!parent) {
        throw this.buildError('MENU_PARENT_NOT_FOUND', 404);
      }
    }

    const targetParentId = parentId ?? null;
    const existing = await this.menuRepo.findByNames({
      nameEs: normalizedNameEs,
      nameEn: normalizedNameEn,
      parentId: targetParentId,
    });

    if (existing) {
      throw this.buildError('MENU_NAME_ALREADY_EXISTS', 409);
    }

    const resolvedLevel = level ?? (parent ? parent.Level + 1 : 1);

    if (parent && resolvedLevel !== parent.Level + 1) {
      throw this.buildError('MENU_INVALID_LEVEL', 400);
    }

    if (!parent && resolvedLevel !== 1) {
      throw this.buildError('MENU_INVALID_LEVEL', 400);
    }

    const menu = new Menu({
      NameEs: normalizedNameEs,
      NameEn: normalizedNameEn,
      ParentId: targetParentId,
      Level: resolvedLevel,
      DisplayOrder: displayOrder ?? 0,
    });

    return this.menuRepo.create(menu);
  }
}

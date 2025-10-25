import { Menu } from '../../domain/entities/Menu';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';

interface UpdateMenuInput {
  nameEs?: string;
  nameEn?: string;
  parentId?: number | null;
  level?: number;
  displayOrder?: number;
}

export default class UpdateMenuUseCase {
  private menuRepo: IMenuRepository;

  constructor({ menuRepo }: { menuRepo: IMenuRepository }) {
    this.menuRepo = menuRepo;
  }

  private buildError(message: string, status: number) {
    const error = new Error(message) as Error & { status?: number };
    error.status = status;
    return error;
  }

  async execute(id: number, { nameEs, nameEn, parentId, level, displayOrder }: UpdateMenuInput) {
    const current = await this.menuRepo.findById(id);
    if (!current) {
      throw this.buildError('MENU_NOT_FOUND', 404);
    }

    if (parentId !== undefined) {
      if (parentId === id) {
        throw this.buildError('MENU_PARENT_CANNOT_BE_SELF', 400);
      }

      if (parentId !== null) {
        const parent = await this.menuRepo.findById(parentId);
        if (!parent) {
          throw this.buildError('MENU_PARENT_NOT_FOUND', 404);
        }
      }
    }

    const targetParentId = parentId !== undefined ? parentId ?? null : current.ParentId;
    let parent: Menu | null = null;
    if (targetParentId !== null) {
      parent = await this.menuRepo.findById(targetParentId);
      if (!parent) {
        throw this.buildError('MENU_PARENT_NOT_FOUND', 404);
      }
    }

    const normalizedNameEs = nameEs !== undefined ? nameEs.trim() : current.NameEs;
    const normalizedNameEn = nameEn !== undefined ? nameEn.trim() : current.NameEn;

    if (nameEs !== undefined && !normalizedNameEs) {
      throw this.buildError('MENU_INVALID_NAME', 400);
    }

    if (nameEn !== undefined && !normalizedNameEn) {
      throw this.buildError('MENU_INVALID_NAME', 400);
    }

    const shouldCheckDup =
      normalizedNameEs !== current.NameEs ||
      normalizedNameEn !== current.NameEn ||
      targetParentId !== current.ParentId;

    if (shouldCheckDup) {
      const existing = await this.menuRepo.findByNames({
        nameEs: normalizedNameEs,
        nameEn: normalizedNameEn,
        parentId: targetParentId,
      });

      if (existing && existing.Id !== id) {
        throw this.buildError('MENU_NAME_ALREADY_EXISTS', 409);
      }
    }

    const resolvedLevel = level ?? (parent ? parent.Level + 1 : 1);

    if (parent && resolvedLevel !== parent.Level + 1) {
      throw this.buildError('MENU_INVALID_LEVEL', 400);
    }

    if (!parent && resolvedLevel !== 1) {
      throw this.buildError('MENU_INVALID_LEVEL', 400);
    }

    const patch: Partial<Menu> = {
      ...(nameEs !== undefined && { NameEs: normalizedNameEs }),
      ...(nameEn !== undefined && { NameEn: normalizedNameEn }),
      ...(parentId !== undefined && { ParentId: targetParentId }),
      ...(displayOrder !== undefined && { DisplayOrder: displayOrder }),
    };

    if (parentId !== undefined || level !== undefined) {
      patch.Level = resolvedLevel;
    }

    return this.menuRepo.update(id, patch);
  }
}

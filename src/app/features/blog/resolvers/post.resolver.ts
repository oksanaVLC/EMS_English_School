import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';

export const postResolver = (route: ActivatedRouteSnapshot) => {
  const slug = route.paramMap.get('slug')!;
  return inject(BlogService).getBySlug(slug);
};

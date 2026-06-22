import { heroSchema } from './hero';
import { headerSchema } from './header';
import { siteSchema } from './site';
import { equipmentSchema } from './equipment';
import { projectSchema } from './project';
import { serviceSchema } from './service';
import { statsSchema } from './stats';
import { advantagesSchema } from './advantages';
import { vacancySchema } from './vacancy';

export const schemaTypes = [
    heroSchema,
    headerSchema,
    siteSchema,
    statsSchema,
    advantagesSchema,
    equipmentSchema,
    projectSchema,
    serviceSchema,
    vacancySchema,
];

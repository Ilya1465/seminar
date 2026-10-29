from tutorial.models import Problem
names = {p.urlname for p in Problem.objects.all()}
for wanted in ('lineup', 'sherenga', 'queens', 'lists_queens'):
    print(wanted, '->', wanted in names)
print('count:', len(names))
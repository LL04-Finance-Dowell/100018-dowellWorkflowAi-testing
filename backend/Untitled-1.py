# email= ['foo@a.coms', 'bar@a.com', 'baz@b.com', 'qux@d.com']
# url=['www.a.com', 'www.b.com', 'www.c.com']
# def url_domain_extractor(url):
#     if url.startswith('www') and url.endswith('com'):
#         return url[4:]
# def email_domain_extractor(email):
#     if '@' in email:
#         return email.split('@')[1]

# def count_email_domains(emails, urls):
#     count={"www"+"."+url_domain_extractor(url):0 for url in urls}
#     for url in urls:
#         for email in emails:
#             try:
#                 if url_domain_extractor(url) == email_domain_extractor(email):
#                     count[url]+=1
#             except:
#                 pass
#     return count
# print(count_email_domains(email,url))

# # def fib(n):
# #     lists=[0,1]
# #     for i in range(n):
# #         if i==0:
# #             lists[i]= i
# #         elif i == 1:
# #             lists[i]= i
# #         elif i >=2:
# #             lists.append(lists[i-1]+lists[i-2])
            
# #     return lists
# # print(fib(7))
# # # def gib(n,x,y):
# # #     # g0=x,g1=y,gn=gn-1 - gn-2
# # #     z=None
# # #     if n>=2:
# # #         for i in range(n+1):
# # #             if i==0:
# # #                 return 0
# # #             elif i==1:
# # #                 return 1
# # #             elif i>=2:
# # #                 z= y-x
# # #                 y=z
# # #                 x=y
# # #                 return z
  
          
# # # print(gib(2, 0, 1))

# # # def gib(n,x,y):
# # #     lists=[x,y]
# # #     if n >=2:
# # #         for i in range(n+1):
# # #             lists.append(lists[i-1]-lists[i-2])
    

# # #         return lists[-1]
# # #     else:
# # #         return n
# # # print(gib(3, 0, 1))
from itertools import permutations
def check(n,m,games):
    val=None
    if n ==2 and m==1:
        val=True
    else:
        for i in range(n):
            n=int(n/2)
            for g in games:
                for game in list(permutations(range(1,n+1))):
                    if g==list(game):
                        continue
                    else:
                        val=False
                        break
    return val
print(check(4, 2, [[1, 2, 3, 4], [1, 3, 2, 4]]))


# print(list(permutations(range(1,4+1))))       
        
        
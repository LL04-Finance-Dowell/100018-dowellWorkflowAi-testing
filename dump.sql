BEGIN;

INSERT INTO `app_favoritedocument` (`_id`,`document_name`,`company_id`,`favourited_by`) VALUES ('640f006709fd22c5e5de2428','Sign-5-D','6390b313d77dc467630713f2','WorkflowAiedwin'),
 ('648a0c40802481b8ee5d0de2','Hermela Document','648748dfa7bdb6007d6b0ed9','HermelaGetnet'),
 ('64fd74b88430e17bee37be3f','INVOICE DOC','644f9c924baba28710c128ac','hycienth_em'),
 ('65007443e616780af9a82584','Payment Document','63b411288295da4b19d7d938','deepak1999');
INSERT INTO `app_favoritetemplate` (`_id`,`company_id`,`template_name`,`favourited_by`) VALUES ('64413320c07cdb569debff40','6433f5a49570991417b27b51','Business Enquiry Form - Chinese Traditional','Yang Li2'),
 ('647f69cd9ecc46de2638d047','6385c0f18eca0fb652c94558','Public Testing','WorkflowAiedwin'),
 ('644a2bea9acedd1e16d1c2b5','6446631fbe4e9931a9c6fa15','Vader Template','githaiga.kairuthi'),
 ('64f056a3a7058c23ee36d1ca','6414123ed59facadd4492e6c','Data Collection Charges - 1','docs@dowellresearch.in'),
 ('6502ee4921842b9d8b96cb28','64188078568bb4565025429b','Template Two','bu_shi_i'),
 ('6502e3be21842b9d8b96c944','64188078568bb4565025429b','Template one (Booking and Reservations)','bu_shi_i');
INSERT INTO `app_favoriteworkflow` (`_id`,`company_id`,`workflows`,`favourited_by`) VALUES ('63f9ef94cc159f1ecaf52e07','6390b313d77dc467630713f2','{"workflow_title": "School Workflow 2", "data_type": "Real_Data", "steps": [{"step_name": "Head Of Department", "role": "Exam Approval", "_id": "14870872-47b9-43db-b4b0-890eaf470188"}, {"step_name": "Students", "role": "Assesment", "_id": "ca0df7c6-d5a3-4eac-ab8f-aab4f5509d5e"}, {"step_name": "Teacher", "role": "Marking", "_id": "85a108a7-e028-47fd-9e2f-c97ac4b1c3e5"}]}','WorkflowAiedwin'),
 ('642531a22c43efd250821ff2','6390b313d77dc467630713f2','{"workflow_title": "Mac 30", "data_type": "Real_Data", "steps": [{"step_name": "Edwin", "role": "Check"}, {"step_name": "Ayoo", "role": "Verify"}, {"step_name": "Eric", "role": "Approve"}]}','WorkflowAiedwin'),
 ('641a13e07b1769ba352ee859','63ac39b94ffaedfa4469c0c6','{"workflow_title": "Workflow1", "data_type": "Real_Data", "steps": [{"step_name": "Pseudo Step name", "role": "Pseudo Role", "_id": "32342378-b5cc-495b-a650-758d54ac8317"}]}','Marven100'),
 ('6449c4e5a6f9263b0de6adc2','64466b1be4c73b3c92c706ec','{"workflow_title": "Flutter Workflow", "steps": [{"step_name": "Flutter", "role": "Development", "_id": "7f0e2927-664e-4ac3-ac66-a934161ed621"}], "data_type": "Archive_Data"}','Sufian3686'),
 ('6411ae66486e0fb7b6216405','6390b313d77dc467630713f2','{"workflow_title": "FinalProcessTesting0", "data_type": "Real_Data", "steps": [{"step_name": "Member", "role": "Member"}, {"step_name": "Legend", "role": "Legend"}]}','WorkflowAivision'),
 ('64a3a02cf3dcb0a913d82a5c','6385c0f28eca0fb652c94575','{"workflow_title": "Hobbies 2023", "steps": [{"step_name": "1. 问题用纸准备", "role": "教员管理员"}, {"step_name": "2. 质询用纸准备", "role": "教员管理员"}, {"step_name": "3. 质询用纸准备", "role": "学生"}, {"step_name": "4.回答的评分", "role": "英语教师"}, {"step_name": "5. 回答的评分", "role": "汉语教师的先生"}, {"step_name": "6. 回答的评分", "role": "法兰西语的先生"}, {"step_name": "7. 回答的评分", "role": "日本语的先生"}, {"step_name": "8. 回答的评分", "role": "西班牙语的先生"}, {"step_name": "9.  回答的评分", "role": "葡萄牙语的先生"}, {"step_name": "10.回答的评分", "role": "德语的先生"}, {"step_name": "11. 回答的评分", "role": "波尔图语的先生"}, {"step_name": "12. 回答的质量评估", "role": "主题的专家"}, {"step_name": "13. 学生向教员的问题用纸的分配", "role": "课程的教员"}, {"step_name": "14. 课程的安排","role": "学生。"}], "data_type": "Real_Data"}','natasha zareen'),
 ('64c77c6227a19bbc5bbe2420','6390b313d77dc467630713f2','{"workflow_title": "Couzy", "steps": [{"step_name": "Step-1", "role": "CEO"}, {"step_name": "Step-2 ", "role": "HR "}, {"step_name": "Step-3 ", "role": "Applicants"}]}','couzy'),
 ('6504bc6956ae1077098ad00f','6462105959fd0f9a283e8f06','{"workflow_title": "Payment ", "steps": [{"step_name": "1", "role": "Data analyst intern "}]}"','AnuroopRoy');
COMMIT;

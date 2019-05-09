using System.Collections.Generic;

namespace KTStore.MP.Core.ModelExt.MNG
{
    public class CategoryModel
    {
        public string CatTypeCode { get; set; }
        public string CatTypeName { get; set; }
        public string CatTypeGroup { get; set; }

        public DataForCategoryTree data
        {
            get =>
                new DataForCategoryTree()
                {
                    CatTypeCode = CatTypeCode,
                    CatTypeGroup = CatTypeGroup,
                    CatTypeName = CatTypeName
                };
        }
        public StateCategoryTree state { get; set; }

        public string text { get; set; }
        public string icon { get; set; }
        public bool HasChild { get; set; }
        public List<CategoryModel> children { get; set; }

    }

    public class StateCategoryTree
    {
        public bool opened { get; set; }
        public bool selected { get; set; }
    }
    public class DataForCategoryTree
    {
        public string CatTypeCode { get; set; }
        public string CatTypeName { get; set; }
        public string CatTypeGroup { get; set; }
    }
}